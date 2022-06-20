const ERROR = require('../constants/error')
const validateOwner = (req, id_user) => {
    const { uid } = req.user
    if (id_user.toString() !== uid.toString()) {
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

const checkManagerRole = (req) => {
    const { role } = req.user
    if (role === 'admin' || role === 'manager')
        return true
    return false
}

const validateRole = {
    validateOwner,
    checkManagerRole
}

module.exports = validateRole