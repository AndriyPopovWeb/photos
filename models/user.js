var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: String,
    email: String,
    password: String,
    admin: Boolean
});

var User = mongoose.model('User', userSchema);
module.exports = User;