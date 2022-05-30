const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const categoriesSchema = Joi.object({
    id_category: Joi.objectId().required(),
});

const postParamsSchema = Joi.object({
    id: Joi.objectId().required(),
    userId: Joi.objectId().required()
});

const postSchema = {
    categoriesSchema,
    postParamsSchema
}

module.exports = postSchema