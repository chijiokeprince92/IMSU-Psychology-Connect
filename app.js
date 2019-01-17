const express = require('express');
const createError = require('http-errors');
const favicon = require('serve-favicon');
const path = require('path');
require('dotenv').config();
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const expressHbs = require('express-handlebars');
const logger = require('morgan');
const debug = require('debug')('library-app:server');


const staffRouter = require('./routes/staff');
const adminRouter = require('./routes/admin');
const studentRouter = require('./routes/student');

const compression = require('compression');
const helmet = require('helmet');

const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// mongoose connections
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

mongoose.connect(process.env.mongoDBO);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Prince,the MongoDB connection error'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
    req.io = io;
    next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: process.env.session_key,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db
    })
}));
app.use(flash());

app.use(compression()); // compress all routes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', studentRouter);
app.use('/staff', staffRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error', {
        message: err.message,
        error: err
    });
});

module.exports = {
    app: app,
    server: server
};