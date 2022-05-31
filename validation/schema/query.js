const Joi = require('joi');

const queryParams = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(10),
    page: Joi.number().integer().default(0),
    orderBy: Joi.string().default('-createdAt'),
    filter: Joi.string(),
});


module.exports = queryParams