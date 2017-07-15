var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var articleListSchema = new Schema({
  uid: ObjectId,
  article: String
},{collection: 'articleList'})
var UserListSchema = new Schema({
  firstname : String,
  lastname : String,
  email: String,
  password: String
}, {collection: 'userData'});
var userData = mongoose.model('userData', UserListSchema);
var articleList = mongoose.model('articleList',articleListSchema);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { success: req.session.success, errors: req.session.errors });
  req.session.success = null;
  req.session.errors = null;

});
router.post('/insert', function(req, res, next) {
  var item = {
    firstname: req.body.fname,
    lastname: req.body.lname,
    email: req.body.email,
    password: req.body.pwd
  };
  var data = new userData(item)

  data.save()

  res.redirect('/');
});
router.get('/show', function(req,res, next){
  articleList.find()
      .then(function(doc){
        res.render('userhome', { items: doc, iden: req.session.iden})
      })

})
router.post('/create', function(req,res,next){
  var item ={
    uid: req.session.iden,
    article: req.body.article
  }
  var data = new articleList(item);
  data.save();
  res.render('userhome', {iden: req.session.iden});
})
router.post('/login', function(req, res, next){
  var email = req.body.email;
  var pwd= req.body.pwd;
  req.session.id = null;
  userData.findOne({ email : email }, '_id password', function (err, doc) {
    if (err != null){
      console.log(err);
      req.session.errors = "User Not Found";
      req.session.success = false;
      res.redirect('/');
    }
    else if (pwd == doc.password){
      console.log("Password Matched",doc._id );
      req.session.iden = doc._id;
      res.render('userhome', {iden : req.session.iden });
    }
    else {
      req.session.errors= "Password Not Matching";
      req.session.success = false;
      res.redirect('/');
    }

    // Space Ghost is a talk show host.
  });
 // console.log(item.pwd);

});
module.exports = router;
