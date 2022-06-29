const BaseModel = require('./BaseModel');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ForumPostSchema = new Schema(
    {
        id_user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        id_topic: {
            type: Schema.Types.ObjectId,
            ref: 'topic'
        },
        createdAt: {
            type: Date,
            required: true,
            default: () => new Date()
        },
        lastUpdatedAt: {
            type: Date,
            required: true,
            default: () => new Date()
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        img_url: {
            type: String
        },
        comment_ids: [
            {
                type: Schema.Types.ObjectId,
                ref: 'post_forum_comment'
            }
        ],
        react_ids: [
            {
                type: Schema.Types.ObjectId,
                ref: 'react'
            }]

    },
    {
        collection: 'post_forum',
        toJSON: {
            transform(doc, ret) {
                delete ret.id
                delete ret.deleted;
                delete ret.deletedAt;
                delete ret.__V
            },
            virtuals: true,
        }
    }
)

ForumPostSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

ForumPostSchema.loadClass(BaseModel)

module.exports = mongoose.model('post_forum', ForumPostSchema)