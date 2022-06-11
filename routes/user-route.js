const express = require('express')

const userRoutes = express.Router();
const userController = require('../controllers/user-controller');

const auth = require('../middleware/authenticator');
const userValidate = require('../validation/user-validate');


userRoutes.get('/',
    auth.authenticateToken,
    auth.checkManagerRoles,
    userController.getAllUser);

userRoutes.get('/:id',
    auth.authenticateToken,
    userController.getUserById)

userRoutes.put('/:id',
    auth.authenticateToken,
    userController.updateUser)

userRoutes.put('/:id/block',
    auth.authenticateToken,
    userValidate.blockUserValidate,
    userController.blockUser)

module.exports = userRoutes;