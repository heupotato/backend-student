const express = require('express')
const apiForumPostRoutes = express.Router()

const forumPostController = require('../controllers/forum-post-controller')
const auth = require('../middleware/authenticator')
const forumPostValidate = require('../validation/forum-post-validate')

const multer = require('multer')

const upload = multer()

apiForumPostRoutes.get('/threads',
    forumPostController.getAllThreads)

apiForumPostRoutes.get('/threads/:id/topics',
    forumPostController.getAllTopicsByThreadId)

apiForumPostRoutes.get('/topics/:id/posts',
    forumPostController.getAllPostsByTopicId)

apiForumPostRoutes.get('/posts/:id',
    forumPostController.getOnePost)

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

apiForumPostRoutes.post('/topics/:id/posts', upload.single('img'),
    auth.authenticateToken,
    forumPostValidate.createPostValidate,
    forumPostController.createPost)

apiForumPostRoutes.put('/posts/:id', upload.single('img'),
    auth.authenticateToken,
    forumPostController.updatePost)

apiForumPostRoutes.put('/posts/:id/delete',
    auth.authenticateToken,
    forumPostController.deletePost)

module.exports = apiForumPostRoutes