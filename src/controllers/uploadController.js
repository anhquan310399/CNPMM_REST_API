// NodeJS module dependencies
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let idSubject = req.query.idSubject;
        let path = `./uploads/${idSubject}/`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        cb(null, `./uploads/${idSubject}/`)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: storage,
    limits: { fileSize: 30 * 1024 * 1024, }
}).single('file');
// //Export routes
// module.exports = function(app, router) {
//     router.post('/fileupload', upload.single('file'), (req, res, next) => {
//         console.log(req.file);
//         let realPath = path.join(appRoot, req.file.path);
//         console.log(realPath);
//         res.status(200).send({
//             file: req.file,
//             path: realPath
//         });
//     });
//     return router;
// }

module.exports = function(app, router) {
    router.post('/fileupload', (req, res, next) => {
        upload(req, res, function(err) {
            if (err) {
                return res.end("Error uploading file.");
            }
            console.log(req.file);
            var realpath = path.join(__dirname, req.file.path);

            res.send({
                file: req.file,
                realpath: realpath
            })
        });
    });
    return router;
}