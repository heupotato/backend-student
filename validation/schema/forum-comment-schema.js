const Joi = require('joi');

const forumCommentSchema = Joi.object({
    content: Joi.string().required()
})

module.exports = forumCommentSchema