const mongoose = require('mongoose');
const MongooseDelete = require('mongoose-delete');
const BaseModel = require('./BaseModel')

const Schema = mongoose.Schema

const TopicSchema = new Schema(
    {
        id_thread: {
            type: Schema.Types.ObjectId,
            ref: 'thread'
        },
        topic: {
            type: String,
            required: true
        },
        post_ids: [
            {
                type: Schema.Types.ObjectId,
                ref: 'post_forum'
            }
        ]
    },
    {
        collection: 'topic',
        toJSON: {
            transform(doc, ret) {
                delete ret.id;
                delete ret.deleted;
                delete ret.deletedAt;
                delete ret.updatedAt
            },
            virtuals: true,
        }
    }
)

TopicSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

TopicSchema.loadClass(BaseModel)

module.exports = mongoose.model('topic', TopicSchema)