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
        ],
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        createdAt: {
            type: Date,
            required: true,
            default: () => new Date()
        },
    },
    {
        collection: 'topic',
        toJSON: {
            transform(doc, ret) {
                delete ret.id;
                delete ret.deleted;
                delete ret.deletedAt;
                delete ret.updatedAt
                delete ret.__v
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