const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const commentSchema = Joi.object({
    id_user: Joi.objectId().required(),
    id_post: Joi.objectId().required(),
    content: Joi.string().required(),
    createdAt: Joi.date().required()
})

module.exports = commentSchema