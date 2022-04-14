var mongoose = require('mongoose');
var authorSchema = new Schema({
    name : {type : String, required: true},
    email: String,
    country : String,

},{timestamps: true});

var Author = mongoose.model("Author",authorSchema);

module.exports = Author;