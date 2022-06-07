const commentService = require('../services/comment')

const getCommentByPostId = (req, res) => {
    return commentService.getCommentByPostId(req, res)
}

const postComment = (req, res) => {
    return commentService.postComment(req, res)
}

const deleteComment = (req, res) => {
    return commentService.deleteComment(req, res)
}
const commentController = {
    getCommentByPostId,
    postComment,
    deleteComment
}

module.exports = commentController