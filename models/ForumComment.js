const BaseModel = require('./BaseModel');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ForumCommentSchema = new Schema(
    {
        id_user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        id_post: {
            type: Schema.Types.ObjectId,
            ref: 'post_news'
        },
        createdAt: {
            type: Date,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            required: true
        },
        img_url: {
            type: String
        },
        id_comment_reply_to: {
            type: Schema.Types.ObjectId,
            ref: 'post_forum_comment'
        }
    },
    {
        collection: 'post_forum_comment',
        toJSON: {
            transform(doc, ret) {
                delete ret.id
                delete ret.deleted;
                delete ret.deletedAt;
                delete ret.lastUpdatedAt
            },
            virtuals: true,
        }
    }
);

ForumCommentSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

ForumCommentSchema.loadClass(BaseModel)

module.exports = mongoose.model('post_forum_comment', ForumCommentSchema)