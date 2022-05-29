const express = require('express')

const authRoutes = express.Router();

const authController = require('../controllers/auth-controller')
const authValidate = require('../validation/auth-validate')

authRoutes.post('/login',
    authValidate.loginValidate,
    authController.login
)

authRoutes.post('/register',
    authValidate.registerValidate,
    authController.register
)
module.exports = authRoutes