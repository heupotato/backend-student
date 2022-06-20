const mongoose = require('mongoose');
const MongooseDelete = require('mongoose-delete');
const BaseModel = require('./BaseModel')

const Schema = mongoose.Schema

const ThreadSchema = new Schema(
    {
        thread: {
            type: String,
            required: true
        },
        topic_ids: [
            {
                type: Schema.Types.ObjectId,
                ref: 'topic'
            }
        ]
    },
    {
        collection: 'thread',
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

ThreadSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

ThreadSchema.loadClass(BaseModel)

module.exports = mongoose.model('thread', ThreadSchema)