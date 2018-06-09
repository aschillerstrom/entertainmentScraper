
var mongoose = require('mongoose');

// Create schema
var Schema = mongoose.Schema;

// comment
var commentSchema = new Schema({

  // name
  author: {
    type: String
  },
  // actual comment
  content: {
    type: String
  }
  
});


// comment model with Mongoose
var comment = mongoose.model('Comment', commentSchema);


module.exports = comment;