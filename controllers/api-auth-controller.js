const authService = require('../services/api-auth-user')

const login = (req, res) => {
    return authService.login(req, res)
}

const register = (req, res) => {
    return authService.register(req, res)
}

const authController = {
    login,
    register
}

module.exports = authController