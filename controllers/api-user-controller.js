const User = require('../models/User')
const userService = require('../services/api-user')

const getAllUser = (req, res) => {
    return userService.getAllUser(req, res)
}

const userController = {
    getAllUser
}

module.exports = userController