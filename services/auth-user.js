const Bcrypt = require('../general/Bcrypt')
const JWT = require('../general/Jwt')

const User = require('../models/User')
const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')
const fileUploadService = require('../utils/FileUpload')
const path = require('path')

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
        const err = {
            code: 400,
            message: ERROR.USER_NOT_FOUND,
            res: 0
        }
        return handleError(res, err)
    }
    const correctPassword = await Bcrypt.compare(password, user.password);
    if (!correctPassword) {
        const err = {
            code: 400,
            message: ERROR.INCORRECT_PASSWORD,
            res: 0
        }
        return handleError(res, err)
    }
    if (user.isBlocked === true) {
        const err = {
            code: 405,
            message: ERROR.NOT_ALLOW,
            res: 0
        }
        return handleError(res, err)
    }
    const token = await JWT.generateToken({ uid: user._id, role: user.role })
    return res.json({
        msg: SUCCEED.LOGIN_SUCCEED,
        token,
        res: 1
    })
}

const register = async (req, res) => {

    const { username, password } = req.body;
    if (await User.exists({ username: username })) {
        const err = {
            code: 400,
            message: ERROR.USERNAME_ALREADY_EXIST,
            res: 0
        }
        return handleError(res, err)
    }

    req.body.password = await Bcrypt.hash(password);
    req.body = { ...req.body, role: 'user' }
    const user = await User.create(req.body)
    const token = await JWT.generateToken({ uid: user._id, role: user.role })

    const file = req.file
    if (file) {
        const filename = user.id.toString() + '_avatar' + path.extname(file.originalname)
        try {
            await fileUploadService.upload(file, filename)

        }
        catch (error) {
            await User.findByIdAndDelete(user.id)
            const err = {
                code: 400,
                message: error,
                res: 0
            }
            return handleError(res, err)
        }

        const url = fileUploadService.bucketUrl + filename
        console.log(url)
        await User.findByIdAndUpdate(user.id, { url_avatar: url })
    }

    return res.json({
        message: SUCCEED.REGISTER_SUCCESS,
        token,
        res: 1
    })
}

const authService = {
    login,
    register
}

module.exports = authService
