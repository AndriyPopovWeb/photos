var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
<<<<<<< HEAD
    userName: String,
=======
    name: String,
>>>>>>> daf276dbd153adbec1ca8ee986d993d977352907
    email: String,
    password: String,
    admin: Boolean
});

var User = mongoose.model('User', userSchema);
module.exports = User;