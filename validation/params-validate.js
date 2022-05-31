const idParam = require('./schema/id-param');
const queryParams = require('./schema/query');
const handleError = require('../general/Error')

const idParamValidate = async (req, res, next) => {
    try {
        const { id } = req.params
        const value = await idParam.validateAsync({ id });
        next()
    }
    catch (err) {
        const data = {
            code: 400,
            message: err.message
        }
        return handleError(res, data)
    }
}

const queryValidate = async (req, res, next) => {
    try {
        const value = await registerSchema.validateAsync(req.query);
        next()
    }
    catch (err) {
        const data = {
            code: 400,
            message: err.message
        }
        return handleError(res, data)
    }
}

const paramsValidate = {
    idParamValidate,
    queryValidate
}

module.exports = paramsValidate