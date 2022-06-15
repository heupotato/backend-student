
const idParam = require('./schema/id-param')
const handleError = require('../general/Error');
const reactSchema = require('./schema/react-schema');
const TopicSchema = require('./schema/topic-schema');
const forumPostSchema = require('./schema/forum-post-schema');
const forumCommentSchema = require('./schema/forum-comment-schema');

const createPostValidate = async (req, res, next) => {
    try {
        const value = await forumPostSchema.newForumPostSchema.validateAsync(req.body)
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

const createCommentValidate = async (req, res, next) => {
    try {
        const value = await forumCommentSchema.validateAsync(req.body)
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
    createPostValidate,
    createReactValidate,
    createTopicValidate,
    createCommentValidate
}

module.exports = postValidate