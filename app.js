var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const fileUpload = require('express-fileupload');

var usersRouter = require('./src/routes/userRouter');

//Database
const dbConfig = process.env.MONGODB_URL;
const mongoose = require("mongoose");

var app = express();
mongoose.Promise = global.Promise;

// enable files upload
app.use(fileUpload({
    createParentPath: true,
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);



var route = express.Router();
route.post('/', (req, res) => {
    let file = req.files.file;
    console.log(file);
    res.send(file);
    //upload.single(file);
});
app.use('/upload', route);

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

let gfs;
// Connecting to the database
mongoose
    .connect(dbConfig, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to the database");
        gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads',
        });
    })
    .catch((err) => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

const storage = new GridFsStorage({
    url: dbConfig,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads',
            };
            resolve(fileInfo);
        });
    },
});

const upload = multer({
    storage,
});

module.exports = app;