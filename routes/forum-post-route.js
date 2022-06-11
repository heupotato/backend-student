const express = require('express')
const apiForumPostRoutes = express.Router()

const forumPostController = require('../controllers/forum-post-controller')
const auth = require('../middleware/authenticator')
const postValidate = require('../validation/post-validate')

apiForumPostRoutes.get('/threads',
    forumPostController.getAllThreads)

apiForumPostRoutes.get('/threads/:id/topics',
    forumPostController.getAllTopicsByThreadId)

apiForumPostRoutes.get('/topics/:id/posts',
    forumPostController.getAllPostsByTopicId)

apiForumPostRoutes.get('/posts/:id/comments',
    forumPostController.getAllCommentsByPostId)

apiForumPostRoutes.post('/posts/:id/react',
    auth.authenticateToken,
    postValidate.createReactValidate,
    forumPostController.createReact)

apiForumPostRoutes.post('/threads/:id/topics',
    auth.authenticateToken,
    postValidate.createTopicValidate,
    forumPostController.createTopic)

apiForumPostRoutes.put('/topics/:id',
    auth.authenticateToken,
    postValidate.createTopicValidate,
    forumPostController.createTopic)

module.exports = apiForumPostRoutes