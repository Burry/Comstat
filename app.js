var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.json');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Comcast login credentials
app.set('username', config.comcastUsername || null);
app.set('password', config.comcastPassword || null);

// custom branding options
app.set('customTitle', config.title || 'Comstat');
app.set('customIcon', config.icon || null);

// port and interface setup
var port = config.port || 3233;
var interface = config.interface || 'localhost';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

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

app.listen(port, interface, function() {
    console.log(app.get('customTitle') + ' is running at ' + 'http://' + interface + ':' + port);
});

module.exports = app;
