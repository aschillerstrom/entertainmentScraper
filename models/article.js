// momentJS library
var moment = require("moment");

// Mongoose
var mongoose = require('mongoose');

// Create a schema
var Schema = mongoose.Schema;

// article schema
var articleSchema = new Schema({

    title: {
      type: String,
      required: true
    },
  
    link: {
      type: String,
      required: true
    },
    
    summary: {
      type: String,
      required: true
    },
  
    updated: {
      type: String,                                             //date or string????
      default: moment().format('MMMM Do YYYY, h:mm A')
    },
  
    comments: [{                                                //should use a different js for notes or can I embed??
      type: Schema.Types.ObjectId,
      ref: 'comments'
    }]
  
  });
  
  // article model with Mongoose
  var Article = mongoose.model('Article', articleSchema);
  
  module.exports = Article;