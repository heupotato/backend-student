const BaseModel = require('./BaseModel');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username:
        {
            type: String,
            required: true
        },
        full_name:
        {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email:
        {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        token:
        {
            type: String,
        },
        url_avatar:
        {
            type: String,
            default: ''
        }
    },
    {
        collection: 'user',
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
                delete ret.updatedAt;
                delete ret.createdAt;
                delete ret.deleted;
                delete ret.id
            },
            virtuals: true,
        },
        timestamps: true,
    }
);

// Add plugin
UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

UserSchema.loadClass(BaseModel)

module.exports = mongoose.model('user', UserSchema);