const handleError = require('../general/Error');
const commentSchema = require('./schema/comment-schema')

const newCommentValidate = async (req, res, next) => {
    try {
        const value = await commentSchema.validateAsync(req.body);
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

const commentValidate = {
    newCommentValidate
}

module.exports = commentValidate