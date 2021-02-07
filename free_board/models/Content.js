var mongoose = require('mongoose');
var contentSchema = mongoose.Schema({
  name:{type:String, required:true},
  content:{type:String, required:true},
});
var Content = mongoose.model('content', contentSchema);
module.exports = Content;
