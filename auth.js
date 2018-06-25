/**
 * Created by andruhovski on 6/13/2017.
 */
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/user')
const config = require('../config/config.js');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/city-fox');
// mongoose.connect('mongodb://heroku_lh81vq31:Start2017@ds121212.mlab.com:21212/heroku_lh81vq3k');

let auth = {
    login2: function(req, res) {
            let username = req.body.username || '';
            let password = req.body.password || '';
            if (username === '' || password === '') {
                res.status(401).json({
                    status: 2,
                    users: [],
                    message: "Invalid credentials"
                });
                return;
            }

            // find the user
            User.findOne({
                username: username
            }, function(err, user) {
                if (err) throw err;
                if (!user) {
                    res.status(401).json({
                        status: 2,
                        users: [],
                        token: '',
                        message: 'Authentication failed. User not found.'
                    });
                } else if (user) {
                    // check if password matches
                    if (user.password !== password) {
                        res.status(401).json({
                            status: 2,
                            users: [],
                            token: [],
                            message: 'Authentication failed. Wrong password.'
                        });
                    } else {
                        let token_user = {
                            name: user.name,
                            username: user.username,
                            admin: user.admin
                        };
                        let token = jwt.sign(token_user, config.secretWord, {
                            expiresIn: 60 * 10 // expires in 24 hours
                        });
                        if (user.admin) {
                            User.find()
                                .limit(10)
                                .select("name username admin").exec(function(err, users) {
                                    res.json({
                                        status: 0,
                                        users: users,
                                        token: token,
                                        message: 'Admin',
                                    });
                                });
                        } else {
                            res.json({
                                status: 1,
                                users: [],
                                token: token,
                                message: 'NotAdmin',
                            });
                        }
                    }
                }
            });
        }
        // validateUser: function (username) {
        //     User.findOne({
        //         username: username
        //     }, function (err, user) {
        //         if (err) throw err;
        //         if (!user) {
        //             res.status(401).json({
        //                 success: false,
        //                 message: 'Authentication failed. User not found.'
        //             });
        //         } else {
        //             return user;
        //         }
        //     });
        // }
};

module.exports = auth;