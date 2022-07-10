const Thread = require('../models/Thread')
const Topic = require('../models/Topic')
const ForumPost = require('../models/ForumPost')
const ForumComment = require('../models/ForumComment')
const ForumReact = require('../models/ForumReact')

const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')
const validateRole = require('./validate-role')
const fileUploadService = require('../utils/FileUpload')
const path = require('path')
const dateHelper = require('../utils/DateHelper')



const getAllThreads = async (req, res) => {
    try {
        const totalPosts = await ForumPost.countDocuments({ isDeleted: false })
        const totalTopics = await Topic.countDocuments({ isDeleted: false })
        const totalComments = await ForumComment.countDocuments({ isDeleted: false })
        const latestPost = await getLatestPost()
        let threadList = await Thread.find()
        threadList = await Promise.all(
            threadList.map(async thread => {
                const threadData = thread._doc
                const topicNum = threadData.topic_ids.length
                const topicIdList = threadData.topic_ids
                const postNum = await ForumPost.countDocuments({ isDeleted: false, id_topic: { $in: topicIdList } })
                const latestPost = await ForumPost
                    .findOne({ isDeleted: false, id_topic: { $in: topicIdList } })
                    .sort({ createdAt: -1 })
                    .populate('id_user', 'full_name')
                let author = "N/A"
                let createdAt = "N/A"

                if (latestPost) {
                    author = latestPost.id_user.full_name
                    createdAt = dateHelper.convertDateInterval(latestPost.createdAt)
                }
                return {
                    thread,
                    topicNum,
                    postNum,
                    author,
                    createdAt
                }
            })
        )

        return res.json({
            msg: SUCCEED.GET_THREADLIST_SUCCESS,
            data: {
                totalPosts,
                totalTopics,
                totalComments,
                threadList,
                latestPost
            },
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message,
            res: 0
        }
        return handleError(res, err)
    }
}

const getAllTopicsByThreadId = async (req, res) => {
    const { id } = req.params
    const perPage = 6
    const page = req.query.page || 1

    try {
        const foundThread = await Thread.findById(id)
        if (!foundThread) throw (ERROR.THREAD_NOT_FOUND)
        const totalTopicsInThread = await Topic.countDocuments({ isDeleted: false, id_thread: id })
        const { topic_ids, thread } = foundThread
        const postNum = await ForumPost.countDocuments({ isDeleted: false, id_topic: { $in: topic_ids } })
        let topicList = await Topic.find({ id_thread: id, isDeleted: false })
            .sort({
                createdAt: -1
            })
            .skip((perPage * page) - perPage)
            .limit(perPage)

        const currentTopicNum = topicList.length
        const start = (perPage * page) - perPage + 1
        const end = start + currentTopicNum - 1

        topicList = await Promise.all(
            topicList.map(async topic => {
                const topicId = topic.id
                const topicName = topic.topic
                const totalPosts = topic.post_ids.length
                const postIds = topic.post_ids
                const totalComments = await ForumComment.countDocuments({ isDeleted: false, id_post: { $in: postIds } })

                const latestPost = await ForumPost
                    .findOne({ id_topic: topic.id, isDeleted: false })
                    .sort({ createdAt: -1 })
                    .populate('id_user', 'full_name')
                const oldestPost = await ForumPost
                    .findOne({ id_topic: topic.id, isDeleted: false })
                    .sort({ createdAt: 1 })
                    .populate('id_user', 'full_name')
                let author = "N/A"
                let date = "N/A"

                const startedAuthor = oldestPost ? oldestPost.id_user.full_name : "N/A"
                if (latestPost) {
                    author = latestPost.id_user.full_name
                    date = dateHelper.convertDateInterval(latestPost.createdAt)
                }

                return {
                    totalPosts,
                    totalComments,
                    author,
                    date,
                    startedAuthor,
                    topicId,
                    topicName
                }
            })
        )
        return res.json({
            msg: SUCCEED.GET_TOPICLIST_SUCCESS,
            data: {
                threadId: id,
                thread,
                totalTopicsInThread,
                postNum,
                perPage,
                currentTopicNum,
                current: page,
                start,
                end,
                topicList
            },
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message || error,
            res: 0
        }
        return handleError(res, err)
    }
}

const getAllPostsByTopicId = async (req, res) => {
    const { id } = req.params
    const perPage = 4
    const page = req.query.page || 1
    try {
        const foundTopic = await Topic.findById(id)
        if (!foundTopic) throw (ERROR.TOPIC_NOT_FOUND)

        const thread = await Thread.findOne({ topic_ids: id })
        const threadId = thread.id
        const threadName = thread.thread
        const { topic } = foundTopic
        const totalPosts = await ForumPost.countDocuments({ id_topic: id, isDeleted: false })
        let postList = await ForumPost.find({ id_topic: id, isDeleted: false })
            .populate(
                [
                    {
                        path: 'id_user',
                        select: 'full_name url_avatar'
                    },
                    {
                        path: 'comment_ids',
                        populate: {
                            path: 'id_user',
                            select: 'full_name url_avatar'
                        },
                        match: { isDeleted: false }
                    }
                ]
            )
            .sort({
                createdAt: -1
            })
            .skip((perPage * page) - perPage)
            .limit(perPage)

        postList = await Promise.all(
            postList.map(async post => {
                const reactNum = await getReactsNum(post.id)
                const createdAtTime = dateHelper.formatDateString(post.createdAt)
                const createdAtStr = dateHelper.convertDateInterval(post.createdAt)
                const lastUpdatedAtTime = dateHelper.formatDateString(post.lastUpdatedAt)
                const lastUpdatedAtStr = dateHelper.convertDateInterval(post.lastUpdatedAt)
                const isReacted = await getisReacted(req, post.id)
                return {
                    post,
                    reactNum,
                    isReacted,
                    createdAtTime,
                    createdAtStr,
                    lastUpdatedAtTime,
                    lastUpdatedAtStr
                }
            })
        )

        const threadList = await getThreadList()

        const recentTopic = await getRecentTopic()

        return res.json({
            msg: SUCCEED.GET_POST_SUCCESS,
            data: {
                threadId,
                threadName,
                id,
                topic,
                current: page,
                perPage,
                totalPages: Math.ceil(totalPosts / perPage),
                postList,
                thread: threadList,
                recentTopic
            },
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message || error,
            res: 0
        }
        return handleError(res, err)
    }

}

const createTopic = async (req, res) => {
    const { id } = req.params
    try {
        const newTopic = await Topic.create({ ...req.body, id_thread: id })
        await Thread.findByIdAndUpdate(id,
            {
                '$addToSet': { 'topic_ids': newTopic._id }
            }
        )
        return res.json({
            msg: SUCCEED.CREATE_TOPIC_SUCCESS,
            data: newTopic,
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message,
            res: 0
        }
        return handleError(res, err)
    }

}

const updateTopic = async (req, res) => {
    const { id } = req.params
    try {
        const newTopic = await Topic.findByIdAndUpdate(id, req.body, { new: true })
        return res.json({
            msg: SUCCEED.UPDATE_TOPIC_SUCCESS,
            data: newTopic,
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message,
            res: 0
        }
        return handleError(res, err)
    }
}

const deleteTopic = async (req, res) => {
    const { id } = req.params
    try {
        const newTopic = await Topic.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
        return res.json({
            msg: SUCCEED.DELETE_TOPIC_SUCCESS,
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message,
            res: 0
        }
        return handleError(res, err)
    }
}

const getOnePost = async (req, res) => {
    const { id } = req.params
    console.log(id)
    const newPost = await ForumPost.findOne({ _id: id, isDeleted: false }).populate('id_user', 'full_name url_avatar role')
    if (!newPost) {
        const err = {
            code: 404,
            message: ERROR.POST_NOT_FOUND,
            res: 0
        }
        return handleError(res, err)
    }

    return res.json({
        message: SUCCEED.GET_POST_SUCCESS,
        data: newPost,
        res: 1
    })
}

const createPost = async (req, res) => {
    const { id } = req.params
    const { uid } = req.user
    const file = req.file

    try {
        let newPost = await ForumPost.create({ ...req.body, id_topic: id, id_user: uid })

        if (file) {
            const filename = newPost.id.toString() + '_forumpost' + path.extname(file.originalname)
            try {
                await fileUploadService.upload(file, filename)
            }
            catch (error) {
                await ForumPost.findByIdAndDelete(newPost.id)
                const err = {
                    code: 400,
                    message: error,
                    res: 0
                }
                return handleError(res, err)
            }

            const url = fileUploadService.bucketUrl + filename
            console.log(url)
            newPost = await ForumPost.findByIdAndUpdate(newPost.id, { img_url: url }, { new: true })
        }
        await Topic.findByIdAndUpdate(id,
            {
                '$addToSet': { 'post_ids': newPost._id }
            }
        )
        return res.json({
            msg: SUCCEED.CREATE_POST_SUCCESS,
            data: newPost,
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message,
            res: 0
        }
        return handleError(res, err)
    }
}

const updatePost = async (req, res) => {
    const { id } = req.params
    const oldPost = await ForumPost.findById(id)
    if (!oldPost) {
        const err = {
            code: 404,
            message: ERROR.POST_NOT_FOUND,
            res: 0
        }
        return handleError(res, err)
    }

    const { id_user, img_url } = oldPost

    const validateUser = validateRole.validateOwner(req, id_user)
    if (!validateRole.checkManagerRole(req)) {
        if (!validateUser.isValid)
            return handleError(res, validateUser.err)
    }

    try {
        const file = req.file
        if (file) {
            const filename = id.toString() + '_forumpost' + path.extname(file.originalname)
            const oldFilename = img_url.replace(fileUploadService.bucketUrl, '')
            try {
                await fileUploadService.deleteFile(oldFilename)
                await fileUploadService.upload(file, filename)
            }
            catch (error) {
                const err = {
                    code: 400,
                    message: error,
                    res: 0
                }
                return handleError(res, err)
            }

            const url = fileUploadService.bucketUrl + filename
            console.log(url)
            await ForumPost.findByIdAndUpdate(id, { img_url: url }, { new: true })
        }
        const today = new Date()
        const newPost = await ForumPost.findByIdAndUpdate(id, { ...req.body, lastUpdatedAt: today }, { new: true })
        return res.json({
            msg: SUCCEED.UPDATE_POST_SUCCESS,
            data: newPost,
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message,
            res: 0
        }
        return handleError(res, err)
    }
}

const deletePost = async (req, res) => {
    const { id } = req.params

    const oldPost = await ForumPost.findById(id)
    if (!oldPost) {
        const err = {
            code: 404,
            message: ERROR.POST_NOT_FOUND,
            res: 0
        }
        return handleError(res, err)
    }

    const { id_user } = oldPost

    const validateUser = validateRole.validateOwner(req, id_user)
    if (!validateRole.checkManagerRole(req)) {
        if (!validateUser.isValid)
            return handleError(res, validateUser.err)
    }

    try {
        await ForumPost.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
        return res.json({
            msg: SUCCEED.DELETE_POST_SUCCESS,
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message,
            res: 0
        }
        return handleError(res, err)
    }

}

const getLatestPost = async () => {
    const latestPost = await ForumPost
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('id_user', 'full_name')
        .select('-comment_ids -react_ids -__v -id_topic')
    return latestPost
}

const getReactsNum = async (id) => {
    const dislike = await ForumReact.countDocuments({ isDeleted: false, id_post: id, type: 'Dislike' })
    const like = await ForumReact.countDocuments({ isDeleted: false, id_post: id, type: 'Like' })
    return {
        dislike,
        like
    }
}

const getThreadList = async () => {
    let threadList = await Thread.find()
    threadList = await Promise.all(
        threadList.map(async thread => {
            const threadId = thread.id
            const threadName = thread.thread
            const topicNum = thread.topic_ids.length
            const topicIdList = thread.topic_ids
            const postNum = await ForumPost.countDocuments({ isDeleted: false, id_topic: { $in: topicIdList } })
            return {
                threadId,
                threadName,
                topicNum,
                postNum
            }
        })
    )
    return threadList
}

const getRecentTopic = async () => {
    let recentTopic = await Topic
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .select('topic createdAt')
        .limit(5)
    recentTopic = await Promise.all(
        recentTopic.map(async topic => {
            const topicId = topic.id
            const topicName = topic.topic
            const createdAtStr = dateHelper.convertDateInterval(topic.createdAt)
            return {
                topicId,
                topicName,
                createdAtStr
            }
        })
    )
    return recentTopic
}

const getisReacted = async (req, id) => {
    if (!req.body)
        return {
            dislike: false,
            like: false
        }
    const { id_user } = req.body
    console.log("body", id_user)
    const reactData = await ForumReact.findOne({ id_user: id_user, id_post: id, isDeleted: false })
    console.log(reactData)
    if (!reactData)
        return {
            dislike: false,
            like: false
        }
    const { type } = reactData
    const isDislike = type === 'Dislike' ? true : false
    return {
        dislike: isDislike,
        like: !isDislike
    }
}

const forumPostService = {
    getAllThreads,
    getAllTopicsByThreadId,
    getAllPostsByTopicId,
    getOnePost,
    createTopic,
    updateTopic,
    deleteTopic,
    createPost,
    updatePost,
    deletePost
}

module.exports = forumPostService