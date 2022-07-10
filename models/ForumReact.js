const BaseModel = require('./BaseModel');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ForumReactSchema = new Schema(
    {
        id_user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        id_post: {
            type: Schema.Types.ObjectId,
            ref: 'post_forum'
        },
        type: {
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        collection: 'react',
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
)

ForumReactSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

ForumReactSchema.loadClass(BaseModel)

module.exports = mongoose.model('react', ForumReactSchema)