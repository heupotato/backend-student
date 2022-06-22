const jwt = require('jsonwebtoken');
const handleError = require('../general/Error')
const ERROR = require('../constants/error')

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization

    if (token == null) {
        const err = {
            code: 401,
            message: ERROR.UNAUTHORIZE, 
            res: 0
        }
        return handleError(res, err)
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            const err = {
                code: 403,
                message: ERROR.FORBIDDEN, 
                res: 0
            }
            return handleError(res, err)
        }
        req.user = data
        next()
    })
}

const checkManagerRoles = (req, res, next) => {
    const role = req.user.role
    if (role !== 'manager' && role !== 'admin') {
        const err = {
            code: 405,
            message: ERROR.NOT_ALLOW, 
            res: 0
        }
        return handleError(res, err)
    }
    next()
}

const auth = {
    authenticateToken,
    checkManagerRoles
}

module.exports = auth