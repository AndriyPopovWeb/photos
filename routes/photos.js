var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
const config = require('../config/config.js');

router.get('/photos', function(req, res, next) {
    console.log("get_photos");
    var images = [
        "https://dummyimage.com/600x400/000/0ff",
        "https://dummyimage.com/600x400/000/f0f",
        "https://dummyimage.com/600x400/000/ff0"
    ];
    res.json({success: true, images: images});
});

module.exports = router;