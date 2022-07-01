const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const newForumPostSchema = Joi.object({
    title: Joi.string().required().max(300),
    content: Joi.string().required()
})

const forumPostSchema = {
    newForumPostSchema
}

module.exports = forumPostSchema