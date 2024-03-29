const handleError = require('../general/Error');
const userSchema = require('./schema/user-schema')

const blockUserValidate = async (req, res, next) => {
    try {
        const value = await userSchema.blockSchema.validateAsync(req.query);
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

const userValidate = {
    blockUserValidate
}

module.exports = userValidate