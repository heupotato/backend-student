const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const categoriesSchema = Joi.object({
    id_category: Joi.objectId().required(),
});

const postParamsSchema = Joi.object({
    id: Joi.objectId().required(),
    userId: Joi.objectId().required()
});

const newPostSchema = Joi.object({
    id_user: Joi.objectId().required(),
    id_category: Joi.objectId().required(),
    title: Joi.string().required().max(300),
    content: Joi.string().required(),
    createdAt: Joi.date().required(),
    lastUpdatedAt: Joi.date().required()
})

const postSchema = {
    categoriesSchema,
    postParamsSchema,
    newPostSchema
}

module.exports = postSchema