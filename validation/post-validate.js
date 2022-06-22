
const idParam = require('./schema/id-param')
const handleError = require('../general/Error');
const reactSchema = require('./schema/react-schema');
const TopicSchema = require('./schema/topic-schema');
const postSchema = require('./schema/post-schema');

const getPostByCategoryValidate = async (req, res, next) => {
    try {
        const value = await idParam.validateAsync(req.params);
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

const createPostValidate = async (req, res, next) => {
    try {
        const value = await postSchema.newPostSchema.validateAsync(req.body)
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


const postValidate = {
    getPostByCategoryValidate,
    createPostValidate
}

module.exports = postValidate