const express = require("express");

const apiAuthRoutes = require('./api-auth-route');
const apiUserRoutes = require('./user')

const apiRoutes = express.Router();

console.log("router")

apiRoutes.use('/auth', apiAuthRoutes)
apiRoutes.use('/user', apiUserRoutes)

module.exports = apiRoutes