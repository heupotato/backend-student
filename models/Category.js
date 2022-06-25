const BaseModel = require('./BaseModel');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
        category: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        },
        post: [
            {
                type: Schema.Types.ObjectId,
                ref: 'post_news'
            }
        ]
    },
    {
        collection: 'post_category',
        toJSON: {
            transform(doc, ret) {
                delete ret.id;
                delete ret.deleted;
                delete ret.deletedAt;
                delete ret.updatedAt; 
                delete ret.order
            },
            virtuals: true,
        }
    }
)

CategorySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

CategorySchema.loadClass(BaseModel)

module.exports = mongoose.model('post_category', CategorySchema)

