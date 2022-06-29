const Thread = require('../models/Thread')
const Topic = require('../models/Topic')
const ForumPost = require('../models/ForumPost')
const ForumComment = require('../models/ForumComment')
const ForumReact = require('../models/ForumReact')

const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')
const validateRole = require('./validate-role')



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
                return {
                    ...threadData,
                    topicNum,
                    postNum
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
        const totalTopicsInThread = await Topic.countDocuments({ isDeleted: false, id_thread: id })
        const { topic_ids, thread } = await Thread.findById(id)
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
                    date = latestPost.createdAt
                }

                return {
                    totalPosts,
                    totalComments,
                    author,
                    date,
                    startedAuthor,
                    topicName
                }
            })
        )
        return res.json({
            msg: SUCCEED.GET_TOPICLIST_SUCCESS,
            data: {
                thread,
                totalTopicsInThread,
                postNum,
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
            message: error.message,
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
        const { topic } = await Topic.findById(id)
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
                        }
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
                return {
                    post,
                    reactNum
                }
            })
        )

        const threadList = await getThreadList()

        const recentTopic = await getRecentTopic()

        return res.json({
            msg: SUCCEED.GET_POST_SUCCESS,
            data: {
                topic,
                current: page,
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
            message: error.message,
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
    try {
        const newPost = await ForumPost.create({ ...req.body, id_topic: id, id_user: uid })
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
    const { id_user } = await ForumPost.findById(id)

    const validateUser = validateRole.validateOwner(req, id_user)

    if (!validateUser.isValid) {
        return handleError(res, validateUser.err)
    }

    try {
        const newPost = await ForumPost.findByIdAndUpdate(id, req.body, { new: true })
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
    const { id_user } = await ForumPost.findById(id)

    const validateUser = validateRole.validateOwner(req, id_user)

    if (!validateUser.isValid) {
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
            const threadName = thread.thread
            const topicNum = thread.topic_ids.length
            const topicIdList = thread.topic_ids
            const postNum = await ForumPost.countDocuments({ isDeleted: false, id_topic: { $in: topicIdList } })
            return {
                threadName,
                topicNum,
                postNum
            }
        })
    )
    return threadList
}

const getRecentTopic = async () => {
    const recentTopic = await Topic
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .select('topic createdAt')
        .limit(5)
    return recentTopic
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