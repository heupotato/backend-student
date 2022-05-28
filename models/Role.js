const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const BaseModel = require('./BaseModel');

const Schema = mongoose.Schema;

const RoleSchema = new Schema(
    {
        role: {
            type: String,
            required: true
        }
    },
    {
        collection: "role",
        toJSON: {
            transform(doc, ret) {
                delete ret.deleted;
                delete ret._id
            },
            virtuals: true,
        }
    }
)

RoleSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

RoleSchema.loadClass(BaseModel)

module.exports = mongoose.model('role', RoleSchema);