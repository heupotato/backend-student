const Joi = require('joi');

const TopicSchema = Joi.object({
    topic: Joi.string().required()
})

module.exports = TopicSchema