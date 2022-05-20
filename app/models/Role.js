const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Role = new Schema(
    {
        role: {
            type:String, 
            required:true
        }
    }, 
    {
        collection: "role"
    }
)

Role.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

module.exports = mongoose.model('role', Role);