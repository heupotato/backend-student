const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const idParam = Joi.object({
    id: Joi.objectId().required(),
});

module.exports = idParam