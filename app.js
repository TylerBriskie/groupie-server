var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
var login = require('./routes/login');
var getMatch = require('./routes/getmatch');
var myprofile = require('./routes/myprofile');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  // Get the value of the Authorization header
  var token = req.get('Authorization');
  if(token) {
    // Authorization header value is in the format:
    // Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW...
    // Remove the first part "Bearer " using substring
    token = token.substring(7);
    console.log(token);
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded){
      if (err) {
        console.log("error:", err)
        // An error signals that the token was not able to be verified
        // Since this Middleware runs on all requests,
        // we call next to continue onto the rest of the middlewares
        // req.user will be undefined in subsequent middlewares/routes
        next();
      } else {
        // If there was no error, the token was verified and decoded
        console.log(decoded);
        // We set the req.user property as the decoded object
        req.user = decoded;
        // we call next to continue onto the rest of the middlewares
        // req.user will contain the JWT payload in subsequent middlewares/routes
        next();
      }
    });
  } else {
    // Didn't find a token in the Authorization header...
    // Carry on...
    next();
  }
});


app.use('/', index);
app.use('/users', users);
app.use('/myprofile', myprofile);
app.use('/signup', signup);
app.use('/login', login);
app.use('/getmatch', getMatch);

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

module.exports = app;
