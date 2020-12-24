var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var passport = require('passport');
var cookieSession = require('cookie-session');

//Database
const dbConfig = process.env.MONGODB_URL;
const mongoose = require("mongoose");

var server = express();
mongoose.Promise = global.Promise;

// enable files upload
// app.use(fileUpload({
//     createParentPath: true,
// }));

server.set('views', path.join(__dirname, 'public/app/views'));
server.set('view engine', 'jade');
server.use(cookieSession({
    // milliseconds of a day
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.HCMUTEUnversityHCMC]
}));
server.use(passport.initialize());
server.use(passport.session());
server.use(cors());
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

// Connecting to the database
mongoose
    .connect(dbConfig, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

//API ROUTES
var usersRouter = require('./src/routes/userRouter');
var privilegeRouter = require('./src/routes/privilegeRouter');
server.use('/user', usersRouter);
server.use('/privilege', privilegeRouter);



// catch 404 and forward to error handler
server.use(function(req, res, next) {
    next(createError(404));
});

// error handler
server.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = server;