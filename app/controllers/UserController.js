const User = require('../models/User')

class UserController{   
    // [GET] /home
    getAllUser(req, res, next) {
        User.find()
            .then(users => {
                console.log(users); 
                res.json(users);
            })
            .catch(next);
    }
}

module.exports = new UserController;