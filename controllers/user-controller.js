const userService = require('../services/user')

const getAllUser = (req, res) => {
    return userService.getAllUser(req, res)
}

const userController = {
    getAllUser
}

module.exports = userController