const express = require('express')
const commentRoutes = express.Router()

const commentController = require('../controllers/comment-controller')

const auth = require('../middleware/authenticator')
const paramsValidate = require('../validation/params-validate')
const commentValidate = require('../validation/comment-validate')

commentRoutes.get('/:id/comments',
    paramsValidate.idParamValidate,
    commentController.getCommentByPostId
)

commentRoutes.post('/comments',
    auth.authenticateToken,
    commentValidate.newCommentValidate,
    commentController.postComment
)

commentRoutes.delete('/comments/:id',
    auth.authenticateToken,
    commentController.deleteComment
)

module.exports = commentRoutes