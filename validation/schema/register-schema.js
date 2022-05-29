const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().required().min(5).max(20),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(30),
    email: Joi.string().required(),
    full_name: Joi.string().required()
})

module.exports = registerSchema