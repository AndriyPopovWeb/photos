var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var config = require('../config/config.js');

router.post('/register', function (req, res, next) {
    console.log(req.body.userName);
    if (req.body.secretWord == config.adminRegistrationPassword) {
        var new_User = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            admin: true
        });
        new_User.save(function (err) {
            if (err) res.render('error', { message: 'write error' });
        });
        return res.json({ 'reg': 'OK' });
    } else {
        return res.json({ 'reg': 'ERR' });
    }
});

module.exports = router;