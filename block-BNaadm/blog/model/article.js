 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var articleSchema = new Schema({
     title : String ,
     description : String,
     tags : [String],
     author: String ,
     likes : {type : Number , default: 0},
     comments : [{type : Schema.Types.ObjectId , ref : "Comment"}]

 });

 var Article = mongoose.model('Article',articleSchema);
 module.exports = Article;