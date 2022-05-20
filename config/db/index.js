const mongoose = require('mongoose');
require('dotenv').config()

async function connect() {

    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log('Connect successfully!!!')
    } catch (error) {
        console.log('Connect failure!!!')
    }

}

module.exports = { connect };