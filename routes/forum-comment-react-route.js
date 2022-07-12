const express = require('express')
const apiForumCommentRoutes = express.Router()
const forumPostValidate = require('../validation/forum-post-validate')
const forumCommentController = require('../controllers/forum-comment-react-controller')
const auth = require('../middleware/authenticator')

const multer = require('multer')

const upload = multer()

apiForumCommentRoutes.get('/posts/:id/comments',
    forumCommentController.getAllCommentsByPostId)

apiForumCommentRoutes.post('/posts/:id/comments', upload.single('img'),
    auth.authenticateToken,
    forumPostValidate.createCommentValidate,
    forumCommentController.createComment)

apiForumCommentRoutes.put('/comments/:id/delete',
    auth.authenticateToken,
    forumCommentController.deleteComment)

apiForumCommentRoutes.put('/comments/:id', upload.single('img'),
    auth.authenticateToken,
    forumCommentController.updateComment)

apiForumCommentRoutes.post('/posts/:id/react',
    auth.authenticateToken,
    forumPostValidate.createReactValidate,
    forumCommentController.createReact)

apiForumCommentRoutes.put('/posts/:id_post/react/delete',
    auth.authenticateToken,
    forumCommentController.deleteReact)

apiForumCommentRoutes.get('/posts/:id/reacts',
    forumCommentController.getAllReactsByPostIds)

module.exports = apiForumCommentRoutes

