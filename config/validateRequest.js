const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

module.exports = function(req, res, next) {
    let bToken = req.headers['authorization'];
    // decode token
    if (bToken) {
        let token = bToken.split(' ');
        // verifies secret and checks exp
        jwt.verify(token[1], config.secretWord, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }
};