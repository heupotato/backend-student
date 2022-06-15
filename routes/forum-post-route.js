const express = require('express')
const apiForumPostRoutes = express.Router()

const forumPostController = require('../controllers/forum-post-controller')
const auth = require('../middleware/authenticator')
const forumPostValidate = require('../validation/forum-post-validate')

apiForumPostRoutes.get('/threads',
    forumPostController.getAllThreads)

apiForumPostRoutes.get('/threads/:id/topics',
    forumPostController.getAllTopicsByThreadId)

apiForumPostRoutes.get('/topics/:id/posts',
    forumPostController.getAllPostsByTopicId)

apiForumPostRoutes.get('/posts/:id',
    forumPostController.getPostById)

apiForumPostRoutes.post('/threads/:id/topics',
    auth.authenticateToken,
    forumPostValidate.createTopicValidate,
    forumPostController.createTopic)

apiForumPostRoutes.put('/topics/:id',
    auth.authenticateToken,
    auth.checkManagerRoles,
    forumPostController.updateTopic)

apiForumPostRoutes.put('/topics/:id/delete',
    auth.authenticateToken,
    auth.checkManagerRoles,
    forumPostController.deleteTopic)

apiForumPostRoutes.post('/topics/:id/posts',
    auth.authenticateToken,
    forumPostValidate.createPostValidate,
    forumPostController.createPost)

apiForumPostRoutes.put('/posts/:id',
    auth.authenticateToken,
    forumPostController.updatePost)

apiForumPostRoutes.put('/posts/:id/delete',
    auth.authenticateToken,
    forumPostController.deletePost)

module.exports = apiForumPostRoutes