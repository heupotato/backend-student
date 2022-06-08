const Joi = require('joi');

const blockSchema = Joi.object({
    isBlocked: Joi.bool().required()
})

const userSchema = {
    blockSchema
}

module.exports = userSchema