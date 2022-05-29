const Bcrypt = require('bcrypt');
const Configs = require('../configs/index')
const bcryptConfig = Configs.getBcryptConfigs();

const compare = (password, hash) => {
    return Bcrypt.compare(password, hash);
}

const hash = (password) => {
    return Bcrypt.hash(password, parseInt(bcryptConfig.saltRounds));
}

const bcrypt = {
    compare,
    hash
}
module.exports = bcrypt