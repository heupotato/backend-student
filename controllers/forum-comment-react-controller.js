const forumCommentService = require('../services/forum-comment-react')

const getAllCommentsByPostId = (req, res) => {
    return forumCommentService.getAllCommentsByPostId(req, res)
}

const createComment = (req, res) => {
    return forumCommentService.createComment(req, res)
}

const deleteComment = (req, res) => {
    return forumCommentService.deleteComment(req, res)
}

const updateComment = (req, res) => {
    return forumCommentService.updateComment(req, res)
}

const createReact = (req, res) => {
    return forumCommentService.createReact(req, res)
}

const deleteReact = (req, res) => {
    return forumCommentService.deleteReact(req, res)
}

const getAllReactsByPostIds = (req, res) => {
    return forumCommentService.getAllReactsByPostIds(req, res)
}

const forumCommentController = {
    getAllCommentsByPostId,
    createComment,
    deleteComment,
    updateComment,
    createReact,
    deleteReact,
    getAllReactsByPostIds
}

module.exports = forumCommentController