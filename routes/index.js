const express = require("express");

const apiAuthRoutes = require('./auth-user-route');
const apiUserRoutes = require('./user-route')

const apiRoutes = express.Router();

apiRoutes.use('/auth', apiAuthRoutes)
apiRoutes.use('/user', apiUserRoutes)

module.exports = apiRoutes