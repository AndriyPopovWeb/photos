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
    res.render('login', { title: 'Login', loginError: false });
});

router.post('/login', function(req, res, next) {
    if (req.body.email == '') {
        res.json({ loginError: -1 });
    }
    if (req.body.password == '') {
        res.json({ loginError: -2 });
    }
    if (User.findOne({ 'email': req.body.email }, function(err, user) {
            if (user == null) {
                return res.json({ loginError: -3 });;
            }
            if (user.password != req.body.password) {
                return res.json({ loginError: -4 });;
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
                    token: token,
                    message: 'Admin',
                });
            } else {
                return res.json({
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