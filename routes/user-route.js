const express = require('express')

const userRoutes = express.Router();
const userController = require('../controllers/user-controller');

const auth = require('../middleware/authenticator')

userRoutes.get('/',
    auth.authenticateManagerToken,
    userController.getAllUser);

module.exports = userRoutes;