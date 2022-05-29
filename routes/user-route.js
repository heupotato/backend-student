const express = require('express')

const userRoutes = express.Router();
const userController = require('../controllers/api-user-controller');

const auth = require('../middleware/authenticator')

userRoutes.get('/',
    auth.authenticateManagerToken,
    userController.getAllUser);

module.exports = userRoutes;