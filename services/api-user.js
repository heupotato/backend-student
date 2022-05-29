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
        msg: SUCCEED.GET_USERLIST_SUCESS,
        userList
    })
}

const userService = {
    getAllUser
}

module.exports = userService