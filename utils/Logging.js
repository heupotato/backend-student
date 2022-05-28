const winston = require('./Winston');

module.exports = {
    verbose: (message, addition = '') => winston.verbose(message, addition),
    warn: (message) => winston.warn(message),
    error: (message, error) => winston.error(`${message}::${error}`),
    info: (message) => winston.info(`${message}`),
};
