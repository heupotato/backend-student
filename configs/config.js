const dotenv = require('dotenv');

dotenv.config();

const assignConfig = (baseConfig, envConfig) => {
    const config = { ...baseConfig };
    return Object.assign(config, envConfig);
};

const config = {
    server: {
        host: process.env.APP_HOST || '0.0.0.0',
        port: process.env.PORT || 3000,
        jwtSecret: process.env.JWT_SECRET || 'student-channel',
        jwtExpiration: process.env.JWT_EXPIRATION || '1h',
        prefix: process.env.APP_ROUTE_PREFIX || '/api/v1'
    },
    bcrypt: {
        saltRounds: process.env.SALT_ROUNDS || 10,
    },
};

const developmentConfig = assignConfig(config, {
    database: {
        connectionString: process.env.DATABASE_URL_DEV,
    },
});

const stagingConfig = assignConfig(config, {
    database: {
        connectionString: process.env.DATABASE_URL_STAGING,
    },
});

const productionConfig = assignConfig(config, {
    database: {
        connectionString: process.env.DATABASE_URL_PRODUCTION,
    },
});

const testingConfig = assignConfig(config, {
    server: {
        host: '0.0.0.0',
        port: 4000,
        jwtSecret: 'student-channel-test',
        jwtExpiration: '1h',
    },
    database: {
        connectionString: process.env.DATABASE_URL_TESTING,
    },
});

module.exports = {
    developmentConfig,
    stagingConfig,
    testingConfig,
    productionConfig,
};
