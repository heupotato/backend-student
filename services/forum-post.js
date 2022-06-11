const Thread = require('../models/Thread')
const Topic = require('../models/Topic')
const ForumPost = require('../models/ForumPost')
const ForumComment = require('../models/ForumComment')

const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')
const ForumReact = require('../models/ForumReact')


const getAllThreads = async (req, res) => {
    const threadList = await Thread.find().populate('topic_ids')

    return res.json({
        msg: SUCCEED.GET_THREADLIST_SUCCESS,
        threadList
    })
}

const getAllTopicsByThreadId = async (req, res) => {
    const { id } = req.params
    const topicList = await Topic.find({ id_thread: id, isDeleted: false }).populate('post_ids')
        .sort({
            createdAt: 1
        })

    return res.json({
        msg: SUCCEED.GET_TOPICLIST_SUCCESS,
        topicList
    })
}

const getAllPostsByTopicId = async (req, res) => {
    const { id } = req.params
    const postList = await ForumPost.find({ id_topic: id, isDeleted: false })
        .sort({
            createdAt: -1
        })

    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        postList
    })

}

const getAllCommentsByPostId = async (req, res) => {
    const { id } = req.params
    const commentList = await ForumComment.find({ id_post: id, isDeleted: false })
        .sort({
            createdAt: -1
        })

    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        commentList
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
            newTopic
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message
        }
        return handleError(res, err)
    }

}

const updateTopic = async (req, res) => {
    const { id } = req.params

    const { id_user } = await Topic.findById(id)
    const validate = validateRole.validateOwner(req, id_user)
    if (!validate.isValid)
        return handleError(res, validate.err)

    try {
        const newTopic = await Topic.findByIdAndUpdate(id, req.body, { new: true })
        return res.json({
            msg: SUCCEED.UPDATE_TOPIC_SUCCESS,
            newTopic
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message
        }
        return handleError(res, err)
    }
}


const createReact = async (req, res) => {
    const { id } = req.params
    const { uid } = req.user
    const { reactType } = req.query
    console.log(typeof reactType);
    const type = reactType === '0' ? 'Dislike' : 'Like'
    var isNewReact = true
    try {
        if (await ForumReact.findOne({ id_post: id, id_user: uid })) {
            isNewReact = false
        }
        const newReact = isNewReact
            ? await ForumReact.create({
                id_post: id, id_user: uid, type: type
            })
            : await ForumReact.findOneAndUpdate({ id_post: id, id_user: uid }, { type: type }, { new: true })
        return res.json({
            msg: SUCCEED.CREATE_REACT_SUCCESS,
            newReact
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message
        }
        return handleError(res, err)
    }

}
const forumPostService = {
    getAllThreads,
    getAllTopicsByThreadId,
    getAllPostsByTopicId,
    getAllCommentsByPostId,
    createReact,
    createTopic,
    updateTopic
}

module.exports = forumPostService