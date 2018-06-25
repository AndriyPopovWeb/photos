var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
    console.log(req.body.email);
    if(req.body.email == ''  ) {
        res.render('login', { title: 'Login', errormessage: 'error email or pass'});
    }
    if( req.body.password == '') {
        res.render('login', { title: 'Login', errormessage: 'error email or pass'});
    }
    if(User.findOne({ email: req.body.email }, function (err, user) {
        if(err) res.render('login', { title: 'Login', errormessage: 'error email or pass'});
        if(user.password !== req.body.password) res.render('login', { title: 'Login', errormessage: 'error email or pass'});
        return res.status(200).json({token: "123"});
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
    new_User.save(function (err) {
        if (err) res.render('error', { message: 'write error' });
    });
    res.render('index', { title: 'Express' });
});
module.exports = router;