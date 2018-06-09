var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request'); 
var cheerio = require('cheerio'); 

// get the comment/note and article models
var comment = require('../models/note.js');
var Article = require('../models/article.js');

// home page for site
router.get('/', function (req, res){
  res.redirect('/scrape');                      //scrapes page
});


// getting articles onto page
router.get('/articles', function (req, res){
    Article.find().sort({_id: -1})          //id orders by date
      // get comments
      .populate('comments')
  
      .exec(function(err, doc){
        // log any errors
        if (err){
          console.log(err);
        } 
        else {
          var hbsObject = {articles: doc}
          res.render('index', hbsObject);
        }
      }); 
  });
  
  
  // scraping
  router.get('/scrape', function(req, res) {
  
    // get onion html
    request('http://www.theonion.com/', function(error, response, html) {

      var $ = cheerio.load(html);
  
      var titlesArray = [];             //should get rid of duplicates....we will see...
  
      $('article .inner').each(function(i, element) {
          var result = {};
  
          // get the title and make a tring
          result.title = $(this).children('header').children('h2').text().trim() + ""; 
  
          // get teh link 
          result.link = 'http://www.theonion.com' + $(this).children('header').children('h2').children('a').attr('href').trim();
  
          // get the summary
          result.summary = $(this).children('div').text().trim() + ""; 
  
          // make sure there ar e no empties
          if(result.title !== "" &&  result.summary !== ""){
  
            // check for duplicates
            if(titlesArray.indexOf(result.title) == -1){
  
              titlesArray.push(result.title);
              Article.count({ title: result.title}, function (err, test){
                if(test == 0){
                    var entry = new article (result);
                    entry.save(function(err, doc) {
                    if (err) {
                      console.log(err);
                    } 
                    else {
                      console.log(doc);
                    }
                  });
  
                }
                else{
                  console.log('Copy - not saved')
                } 
              });
          }
          else{
            console.log('copy - not saved')
          }
        }
        else{
          console.log('empty - not saved')
        }
      });
    res.redirect("/articles"); 
    }); 
  });
  
  
  // add comments
  router.post('/add/comment/:id', function (req, res){
    var articleId = req.params.id;
    var commentAuthor = req.body.name;
    var commentContent = req.body.comment;
    var result = {
      author: commentAuthor,
      content: commentContent
    };
  
    // comment model for new comment
    var entry = new comment (result);
    // save it
    entry.save(function(err, doc) {
      // log errors
      if (err) {
        console.log(err);
      } 
      else {
        // put comment in comment section
        Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments':doc._id}}, {new: true})
        .exec(function(err, doc){
          // log errors
          if (err){
            console.log(err);
          } else {
            // send scucess
            res.sendStatus(200);
          }
        });
      }
    }); 
  });
  
  
  // delete comments
  router.post('/remove/comment/:id', function (req, res){
  
    // get comment id
    var commentId = req.params.id;
  
    // and delete it by the id
    comment.findByIdAndRemove(commentId, function (err, todo) {  
      
      if (err) {
        console.log(err);
      } 
      else {
        // successful
        res.sendStatus(200);
      }
    });  
  });

  // export to serverjs
  module.exports = router;



//used https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping
// https://thexvid.com/video/HP-HP0jPzMQ/web-scraping-with-node-js-3-using-cheerio.html