const loginSchema = require('./schema/login-schema');
const handleError = require('../general/Error');
const registerSchema = require('./schema/register-schema');

const loginValidate = async (req, res, next) => {
    try {
        const value = await loginSchema.validateAsync(req.body);
        next()
    }
    catch (err) {
        const data = {
            code: 400,
            message: err.message,
            res: 0
        }
        return handleError(res, data)
    }
}

const registerValidate = async (req, res, next) => {
    try {
        const value = await registerSchema.validateAsync(req.body);
        next()
    }
    catch (err) {
        const data = {
            code: 400,
            message: err.message,
            res: 0
        }
        return handleError(res, data)
    }
}

const authValidate = {
    loginValidate,
    registerValidate
}

module.exports = authValidate