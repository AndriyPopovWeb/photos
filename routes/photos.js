const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const PhotoDetails = require('../models/photoDetails.js');
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
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.json({
                err: 'No files exist'
            });
        }
        let returnedData = [];
        files.forEach(function(file) {
            PhotoDetails.findOne({ fileId: file._id }, (err, photoDetails) => {
                if (req.user.admin) {
                    returnedData.push({
                        file: file,
                        description: photoDetails.description
                    });
                } else {
                    if (req.user.username == photoDetails.user) {
                        returnedData.push({
                            file: file,
                            description: photoDetails.description
                        });
                    }
                }
            });
        });
        setTimeout(() => {
            return res.json(returnedData);
        }, 200);
    });
});

router.post('/photos', upload.single('file'), (req, res) => {
    gfs.files.findOne({ filename: req.file.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        var new_PhotoDetails = new PhotoDetails({
            user: req.user.username,
            description: req.body.description,
            fileId: file._id
        });
        new_PhotoDetails.save(function(err) {
            if (err) res.render('error', { message: 'write error' });
        });
    });
    return res.json({ success: true });
});

router.delete('/photos/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).json({ err: err });
        }
        PhotoDetails.remove({ fileId: req.params.id });
        return res.json({ success: true });
    });
});

module.exports = router;