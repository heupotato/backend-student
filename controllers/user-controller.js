const userService = require('../services/user')

const getAllUser = (req, res) => {
    return userService.getAllUser(req, res)
}

const getUserById = (req, res) => {
    return userService.getUserById(req, res)
}

const updateUser = (req, res) => {
    return userService.updateUser(req, res)
}

const blockUser = (req, res) => {
    return userService.blockUser(req, res)
}

const userController = {
    getAllUser,
    getUserById,
    updateUser,
    blockUser
}

module.exports = userController