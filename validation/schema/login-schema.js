const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().required().min(5).max(20),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(30),
})

module.exports = loginSchema