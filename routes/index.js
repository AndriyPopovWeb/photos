var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
const config = require('../config/config.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
    if (req.body.email == '') {
        res.render('login', { title: 'Login', errormessage: 'error email or pass' });
    }
    if (req.body.password == '') {
        res.render('login', { title: 'Login', errormessage: 'error email or pass' });
    }
    if (User.findOne({ 'email': req.body.email }, function(err, user) {
            if (user == null) {
                res.render('login', { title: 'Login', errormessage: 'error email or pass' });
                return;
            }
            if (user.password != req.body.password) {
                res.render('login', { title: 'Login', errormessage: 'error email or pass' });
                return;
            }
            let token_user = {
                name: user.name,
                username: user.email,
                admin: user.admin
            };
            let token = jwt.sign(token_user, config.secretWord, {
                expiresIn: 60 * 10
            });
            if (user.admin) {
                return res.json({
                    status: 0,
                    token: token,
                    message: 'Admin',
                });
            } else {
                return res.json({
                    status: 1,
                    token: token,
                    message: 'NotAdmin',
                });
            }
        }));
});

router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });
});

router.post('/register', function(req, res, next) {
    console.log(req.body.userName)
    var new_User = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        admin: false
    });
    console.log(new_User);
    new_User.save(function(err) {
        if (err) res.render('error', { message: 'write error' });
    });
    res.render('index', { title: 'Express' });
});
module.exports = router;