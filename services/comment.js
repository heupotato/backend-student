const Comment = require('../models/Comment')
const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')
const User = require('../models/User')

const getCommentByPostId = async (req, res) => {
    const { id } = req.params
    const commentList = await Comment.find({ id_post: id, isDeleted: false })
    return res.json({
        msg: SUCCEED.GET_COMMENT_SUCCESS,
        data: commentList, 
        res: 1
    })
}

const postComment = async (req, res) => {
    const newComment = await Comment.create(req.body)
    return res.json({
        msg: SUCCEED.CREATE_COMMENT_SUCCESS,
        data: newComment, 
        res: 1
    })

}

const deleteComment = async (req, res) => {
    const { id } = req.params
    const validate = await validateUser(req)

    if (!validate.isValid)
        return handleError(res, validate.err)

    const today = new Date()
    try {
        await Comment.findByIdAndUpdate(id, { isDeleted: true, deletedAt: today }, { new: true })

        return res.json({
            msg: SUCCEED.DELETE_COMMENT_SUCCESS,
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

const validateUser = async (req) => {
    const { id } = req.params
    const { id_user } = await Comment.findById(id)
    const { role, userId } = req.user

    if (role === 'admin' || role === 'manager')
        return {
            isValid: true
        }

    if (id_user.toString() !== userId) {
        const err = {
            code: 405,
            message: ERROR.NOT_ALLOW,
            res: 0
        }
        return {
            isValid: false,
            err: err
        }
    }

    return {
        isValid: true
    }
}

const commentService = {
    getCommentByPostId,
    postComment,
    deleteComment
}

module.exports = commentService