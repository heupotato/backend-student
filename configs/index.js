const _get = require('lodash/get');
const dotenv = require('dotenv');
const Config = require('./config');

dotenv.config();
// Read Configurations
const configs = _get(Config, `${process.env.NODE_ENV || 'development'}Config`);

const getServerConfigs = () => _get(configs, 'server');

const getBcryptConfigs = () => _get(configs, 'bcrypt');

const getDatabaseConfigs = () => _get(configs, 'database');

module.exports = {
    getServerConfigs,
    getBcryptConfigs,
    getDatabaseConfigs,
};
