const express = require('express')

const authRoutes = express.Router();

const authController = require('../controllers/auth-controller')
const authValidate = require('../validation/auth-validate')

const multer = require('multer')

const upload = multer()

authRoutes.post('/login',
    authValidate.loginValidate,
    authController.login
)

authRoutes.post('/register', upload.single('img'),
    authValidate.registerValidate,
    authController.register
)
module.exports = authRoutes