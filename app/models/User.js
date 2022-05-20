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
        fullName: 
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
            type: String, required: true 
        },
        idRole: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'role'
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
        urlAvatar: 
        { 
            type: String
        }
    }, 
    {
        collection: 'user'
    }
);

// Add plugin
UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

UserSchema.loadClass(BaseModel)

module.exports = mongoose.model('user', UserSchema);