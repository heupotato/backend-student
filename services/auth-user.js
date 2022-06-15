const Bcrypt = require('../general/Bcrypt')
const JWT = require('../general/Jwt')

const User = require('../models/User')
const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
        const err = {
            code: 400,
            message: ERROR.USER_NOT_FOUND
        }
        return handleError(res, err)
    }
    const correctPassword = await Bcrypt.compare(password, user.password);
    if (!correctPassword) {
        const err = {
            code: 400,
            message: ERROR.INCORRECT_PASSWORD
        }
        return handleError(res, err)
    }
    if (user.isBlocked === true) {
        const err = {
            code: 405,
            message: ERROR.NOT_ALLOW
        }
        return handleError(res, err)
    }
    const token = await JWT.generateToken({ uid: user._id, role: user.role })
    return res.json({
        msg: SUCCEED.LOGIN_SUCCEED,
        token
    })
}

const register = async (req, res) => {
    const { username, password } = req.body;
    if (await User.exists({ username: username })) {
        const err = {
            code: 400,
            message: ERROR.USERNAME_ALREADY_EXIST
        }
        return handleError(res, err)
    }
    req.body.password = await Bcrypt.hash(password);
    req.body = { ...req.body, role: 'user' }
    const user = await User.create(req.body)
    const token = await JWT.generateToken({ uid: user._id, role: user.role })
    return res.json({
        message: SUCCEED.REGISTER_SUCCESS,
        token
    })
}

const authService = {
    login,
    register
}

module.exports = authService
