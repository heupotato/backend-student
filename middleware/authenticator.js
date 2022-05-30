const jwt = require('jsonwebtoken');
const handleError = require('../general/Error')
const ERROR = require('../constants/error')

const authenticateManagerToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader

    if (token == null) {
        const err = {
            code: 401,
            message: ERROR.UNAUTHORIZE
        }
        return handleError(res, err)
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err || (data.role !== 'manager' && data.role !== 'admin')) {
            const err = {
                code: 403,
                message: ERROR.FORBIDDEN
            }
            return handleError(res, err)
        }
        req.user = data
        next()
    })
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader

    if (token == null) {
        const err = {
            code: 401,
            message: ERROR.UNAUTHORIZE
        }
        return handleError(res, err)
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            const err = {
                code: 403,
                message: ERROR.FORBIDDEN
            }
            return handleError(res, err)
        }
        req.user = data
        next()
    })
}
const auth = {
    authenticateManagerToken,
    authenticateToken
}

module.exports = auth