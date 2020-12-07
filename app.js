var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const fileUpload = require('express-fileupload');

var usersRouter = require('./src/routes/userRouter');

//Database
const dbConfig = process.env.MONGODB_URL;
const mongoose = require("mongoose");

var app = express();
mongoose.Promise = global.Promise;
//Set up muler
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})


var upload = multer().single('file')

//**THIS IS MANDATORY, WITHOUT THIS NOT WORK**
app.use(multer({
    storage: storage
}).single('file'));

// enable files upload
app.use(fileUpload({
    createParentPath: true,
}));
// view engine setup
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

app.post('/upload', (req, res) => {
    console.log(req.file);
    upload(req, res, function(err) {
        if (err) {
            res.status(500).json({ 'success': false });
            return;
        }
        res.send(req.file);
    });

});

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