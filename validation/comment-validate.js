const handleError = require('../general/Error');
const commentSchema = require('./schema/comment-schema')

const newCommentValidate = async (res, req, next) => {
    try {
        const value = await commentSchema.validateAsync(req.body);
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

const commentValidate = {
    newCommentValidate
}

module.exports = commentValidate