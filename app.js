var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var passport = require('passport');
var bodyParser = require('body-parser');
var BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');
const config = require('./config/config.js');

var indexRouter = require('./routes/index');
var photosRouter = require('./routes/photos');
var imageRouter = require('./routes/image');
var adminRegistrationRouter = require('./routes/adminRegistration');
var mongoose = require('mongoose');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/photos');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

passport.use(new BearerStrategy((token, done) => {
    try {
        jwt.verify(token, config.secretWord, function (err, decoded) {
            if (err) {
                throw err;
            } else {
                done(null, decoded);
            }
        });
    } catch (error) {
        done(null, false);
    }
}));

app.all('/api/*', [passport.authenticate('bearer', { session: false })]);

app.use('/api/', photosRouter);
app.use('/', indexRouter);
app.use('/image', imageRouter);
app.use('/admin/', adminRegistrationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;