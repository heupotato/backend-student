const User = require("../models/User")
const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')

const getAllUser = async (req, res) => {
    const userList = await User.find()
    if (!userList) {
        const err = {
            code: 400,
            message: ERROR.USER_LIST_NOT_EXIST
        }
        return handleError(res, err)
    }

    return res.json({
        msg: SUCCEED.GET_USERLIST_SUCCESS,
        userList
    })
}

const getUserById = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
        const err = {
            code: 400,
            message: ERROR.USER_NOT_FOUND
        }
        return handleError(res, err)
    }

    return res.json({
        msg: SUCCEED.GET_USER_SUCCESS,
        user
    })
}

const updateUser = async (req, res) => {
    const { id } = req.params
    const validate = await validateUser(req, id)

    if (!validate.isValid)
        return handleError(res, validate.err)
    try {
        const newUser = await User.findByIdAndUpdate(id, req.body, { new: true, })
        res.json({
            msg: SUCCEED.UPDATE_USER_SUCCESS,
            newUser
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message
        }
        return handleError(res, err)
    }
}

const blockUser = async (req, res) => {
    const { id } = req.params
    const { isBlocked } = req.query

    if (!validateManage(req)) {
        const err = {
            code: 405,
            message: ERROR.NOT_ALLOW
        }
        return handleError(res, err)
    }

    try {
        await User.findByIdAndUpdate(id, { isBlocked: isBlocked }, { new: true })
        const message = isBlocked === 'true' ? SUCCEED.BLOCK_USER_SUCCESS : SUCCEED.UNBLOCK_USER_SUCCESS
        res.json({
            msg: message
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message
        }
        return handleError(res, err)
    }
}

const validateUser = async (req, id) => {
    const { uid, role } = req.user
    if (role === 'admin') {
        return {
            isValid: true
        }
    }
    if (uid !== id) {
        const err = {
            code: 405,
            message: ERROR.NOT_ALLOW
        }
        return {
            isValid: false,
            err: err
        }
    }

    return {
        isValid: true
    }

}

const validateManage = (req) => {
    const { role } = req.user
    if (role === 'admin' || role === 'manager') {
        return true
    }
    return false
}

const userService = {
    getAllUser,
    getUserById,
    updateUser,
    blockUser
}

module.exports = userService