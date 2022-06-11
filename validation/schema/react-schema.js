const Joi = require('joi');

const reactSchema = Joi.object({
    reactType: Joi.number().min(0).max(1)
})

module.exports = reactSchema