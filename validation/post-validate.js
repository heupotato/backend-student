const postSchema = require('./schema/post-schema')
const idParam = require('./schema/id-param')
const handleError = require('../general/Error')

const getPostByCategoryValidate = async (req, res, next) => {
    try {
        const value = await postSchema.categoriesSchema.validateAsync(req.body);
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

const postValidate = {
    getPostByCategoryValidate,
}

module.exports = postValidate