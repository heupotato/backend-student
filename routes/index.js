const express = require("express");

const apiAuthRoutes = require('./auth-user-route');
const apiUserRoutes = require('./user-route')
const apiPostRoutes = require('./post-route')
const apiCommentRoutes = require('./comment-route')
const apiForumPostRoutes = require('./forum-post-route');
const apiForumCommentRoutes = require("./forum-comment-react-route");

const apiRoutes = express.Router();

apiRoutes.use('/auth',
    apiAuthRoutes)

apiRoutes.use('/users',
    apiUserRoutes)

apiRoutes.use('/news',
    apiPostRoutes,
    apiCommentRoutes)

apiRoutes.use('/forum',
    apiForumPostRoutes,
    apiForumCommentRoutes)

module.exports = apiRoutes