var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

//Database
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var mongoDB = 'mongodb://localhost/discin?retryWrites=true';
mongoose.connect(mongoDB, {useNewUrlParser: true});
require('./models/users')
require('./models/discs')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

//Routes
var indexRouter = require('./routes/api/index');
var usersRouter = require('./routes/api/users');
var discRouter = require('./routes/discs');
var authRouter = require('./routes/auth');

var app = express();

//Passport config
var passport = require('./config/passport');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/discs', discRouter);
app.use('/users', usersRouter)
//app.use('/api', routes.api)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  if(401 == err.status) {
      res.send('Need to login first')
  }
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
