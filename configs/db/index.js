const mongoose = require('mongoose');
const Configs = require('../index');
const logger = require('../../utils/Logging');

const dbConfigs = Configs.getDatabaseConfigs();

const connect = async () => {
    try {
        await mongoose.connect(dbConfigs.connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('> Connection with database succeeded.');
    } catch (err) {
        logger.error(err);
    }
};
module.exports = connect;
