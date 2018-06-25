const mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {
    createUser: function(req, res) {
        var new_User = new User(req.body);
        new_User.saveAsync()
            .then(user => res.status(200).json(userss))
            .catch(err => res.status(500).json(err))
    }
}