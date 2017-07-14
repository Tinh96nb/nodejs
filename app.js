var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport')
//import router
var index = require('./routes/index');
var chat = require('./routes/chat');
var chatbot = require('./routes/chatbot');
var login = require('./routes/login');
var sp = require('./lib/spchat');
// var ab = require('./models/user');
// ab.connect();
// ab.getuser();
var app = express();

//socket io
var http = require('http').Server(app);
var io = require('socket.io')(http);
sp.chat(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret : "secret",
  saveUninitialized: true,
  resave: true,
  cookie : {
    maxAge : 1000*60*5
  }
}))
app.use(passport.initialize());
app.use(passport.session());
//process router
app.use('/', index);
app.use('/chat', chat);
app.use('/login', login);
app.use('/chatbot', chatbot);
app.get('/index',function(req,res){
  if(req.isAuthenticated()){
    res.send("da dang nhap roi");
  } else {
    res.send("Ban chua dang nhap");
  }
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//run server
http.listen(process.env.PORT || 3000, function () {
    console.log('Server listen on port 3000!')
});