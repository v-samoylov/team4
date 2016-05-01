"use strict";

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '/tmp/uploads'),
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now())
});

var upload = multer({storage: storage});

exports.array = upload.array();

exports.cb = req => {
    console.log(req.files.length);
};
