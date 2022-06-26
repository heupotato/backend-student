const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const commentSchema = Joi.object({
    id_post: Joi.objectId().required(),
    content: Joi.string().required(),
})

module.exports = commentSchema