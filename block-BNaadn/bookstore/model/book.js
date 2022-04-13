var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title : {type : String, required : true},
    summery : String,
    pages : {type :Number, required : true},
    publication : String,
    cover_image : {
        data: Buffer
    },
    category:[{type:String}],
    authors: [{type:Schema.Types.ObjectId, ref:"Author", required:true }]
}, {timestamps:true});

var Book = mongoose.model("Book",bookSchema);

module.exports = Book;