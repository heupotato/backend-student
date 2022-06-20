const Joi = require('joi');

const forumCommentSchema = Joi.object({
    content: Joi.string().required(),
    createdAt: Joi.date().required(),
    lastUpdatedAt: Joi.date().required()
})

module.exports = forumCommentSchema