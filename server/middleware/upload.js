// server/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configure multer to store files in memory
module.exports = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error('File type is not supported'), false);
            return;
        }
        cb(null, true);
    },
});