const Thread = require('../models/Thread')
const Topic = require('../models/Topic')
const ForumPost = require('../models/ForumPost')

const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')
const validateRole = require('./validate-role')



const getAllThreads = async (req, res) => {
    const threadList = await Thread.find().populate('topic_ids')

    return res.json({
        msg: SUCCEED.GET_THREADLIST_SUCCESS,
        data: threadList, 
        res: 1
    })
}

const getAllTopicsByThreadId = async (req, res) => {
    const { id } = req.params
    const topicList = await Topic.find({ id_thread: id, isDeleted: false })
        .populate({
            path: 'post_ids',
            populate: {
                path: 'id_user',
                select: 'full_name url_avatar'
            }
        })
        .sort({
            createdAt: 1
        })

    return res.json({
        msg: SUCCEED.GET_TOPICLIST_SUCCESS,
        data: topicList, 
        res: 1
    })
}

const getAllPostsByTopicId = async (req, res) => {
    const { id } = req.params
    const postList = await ForumPost.find({ id_topic: id, isDeleted: false })
        .populate(
            [
                {
                    path: 'id_user',
                    select: 'full_name url_avatar'
                }
            ]
        )
        .sort({
            createdAt: -1
        })

    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        data: postList, 
        res: 1
    })

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