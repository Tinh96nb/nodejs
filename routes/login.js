var express = require('express');
var passport = require('passport')
var localStrategy = require('passport-local').Strategy;
var fs = require('fs');
var session = require('express-session');
var router = express.Router();
var app = express();

router.get('/',function (req,res){
  if(req.isAuthenticated()){
    res.redirect('/')
  } else {
    res.render('login')
  }
})
router.post('/',passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }))

passport.use(new localStrategy(
    function (username,password,done) {
      fs.readFile('./models/use.json',function (err,data){
        var db = JSON.parse(data);
        var userRecord = db.find(user=> user.username == username);
        if(userRecord && userRecord.password == password){
          return done(null,userRecord);
        }
        else {
          return done(null,false);
        }
      });
    }
));
//lưu vào với id khi chứng thực ok
passport.serializeUser(function(user, done) {
    done(null, user.username);
});
//lay ra de so sanh
passport.deserializeUser(function(username, done) {
     fs.readFile('./models/use.json',function (err,data){
        var db = JSON.parse(data);
        var userRecord = db.find(user=> user.username == username);
        if(userRecord){
          return done(null,userRecord);
        } else {
          return done(null,false);
        }
     });
});
module.exports = router;