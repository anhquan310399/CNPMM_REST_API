var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const fileUpload = require('express-fileupload');
var multer = require('multer');
var router = express.Router();
var usersRouter = require('./src/routes/userRouter');
global.appRoot = path.resolve(__dirname);
//Database
const dbConfig = process.env.MONGODB_URL;
const mongoose = require("mongoose");
const { resolve } = require('path');

var app = express();
mongoose.Promise = global.Promise;

// enable files upload
// app.use(fileUpload({
//     createParentPath: true,
// }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Firebase 

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

app.use('/user', usersRouter);
var upload = require("./src/controllers/uploadController")(app, router);

app.use('/', upload);

app.get('/download/:path', (req, res) => {
    console.log(req.params.path);
    var path = path.join(__dirname, '\\uploads\\subject\\NguyenAnhQuan.jpg');
    res.download(path);
})

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
    res.render('error');
});

module.exports = app;