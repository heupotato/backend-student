const BaseModel = require('./BaseModel');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        id_user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        createdAt: {
            type: Date,
            required: true
        },
        lastUpdatedAt: {
            type: Date,
            required: true
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
        id_category: {
            type: Schema.Types.ObjectId,
            ref: 'post_category'
        },
        comment_ids: [
            {
                type: Schema.Types.ObjectId,
                ref: 'post_comment'
            }
        ],
        comment_length: {
            type: Number,
            required: true

        }

    },
    {
        collection: 'post_news',
        toJSON: {
            transform(doc, ret) {
                delete ret.id
                delete ret.deleted;
                delete ret.deletedAt;
            },
            virtuals: true,
        }
    }
)

PostSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

PostSchema.loadClass(BaseModel)

module.exports = mongoose.model('post_news', PostSchema)