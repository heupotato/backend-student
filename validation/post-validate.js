const postSchema = require('./schema/post-schema')
const idParam = require('./schema/id-param')
const handleError = require('../general/Error');
const reactSchema = require('./schema/react-schema');
const TopicSchema = require('./schema/topic-schema');

const getPostByCategoryValidate = async (req, res, next) => {
    try {
        const value = await idParam.validateAsync(req.params);
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

const createPostValidate = async (req, res, next) => {
    try {
        const value = await postSchema.newPostSchema.validateAsync(req.body)
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

const createReactValidate = async (req, res, next) => {
    try {
        const value = await reactSchema.validateAsync(req.query)
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

const createTopicValidate = async (req, res, next) => {
    try {
        const value = await TopicSchema.validateAsync(req.body)
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
    createPostValidate,
    createReactValidate,
    createTopicValidate
}

module.exports = postValidate