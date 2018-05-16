var express = require('express');
var createError = require('http-errors')
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressHbs = require('express-handlebars');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');


var app = express();

// mongoose connections
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/behaviourist';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/', catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
});

module.exports = app;