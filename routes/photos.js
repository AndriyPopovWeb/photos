const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const mongoURI = 'mongodb://127.0.0.1:27017/photos';

const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

router.get('/photos', function(req, res, next) {
    console.log(req.user);
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.json({
                err: 'No files exist'
            });
        }
        return res.json(files);
    });
});

router.post('/photos', upload.single('file'), (req, res) => {
    gfs.files.find({'filename': req.file.filename}).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.json({
                err: 'No files exist'
            });
        }
        
    });
    return res.json({ success: true });
});

router.delete('/photos/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).json({ err: err });
        }
        return res.json({ success: true });
    });
});

module.exports = router;