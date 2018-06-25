const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
//let validateUser = require('../handlers/auth').validateUser;
module.exports = function(req, res, next) {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app is safe.
    // We skip the token auth for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();
    console.log(req.protocol + '://' + req.get('host') + req.originalUrl);

    let token = req.headers['bearer-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
<<<<<<< HEAD
        jwt.verify(token, config.secretWord, function(err, decoded) {
=======
        jwt.verify(token, config.jwtSecret, function(err, decoded) {
>>>>>>> daf276dbd153adbec1ca8ee986d993d977352907
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                console.log('Username present: ' + req.decoded.hasOwnProperty('username'));
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        if (req.headers['x-debug-mode'] !== undefined) {
            console.log('Runing debug mode!');
            req.decoded = { 'username': req.headers['x-debug-mode'] };
            next();
        } else return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};