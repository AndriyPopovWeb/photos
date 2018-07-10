var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoDetailsSchema = new Schema({
    user: String,
    description: String,
    fileId: String
});

var PhotoDetails = mongoose.model('PhotoDetails', photoDetailsSchema);
module.exports = PhotoDetails;