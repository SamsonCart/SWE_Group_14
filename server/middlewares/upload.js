const multer = require('multer');
const path = require('path');
const fs = require('fs');

const TEMP_DIR = 'uploads/temp';
const LIVE_DIR = 'uploads/images';
const MAX_FILES = 5;

const createDirectories = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  if (!fs.existsSync(LIVE_DIR)) {
    fs.mkdirSync(LIVE_DIR, { recursive: true });
  }
};

createDirectories();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage, limits: { files: MAX_FILES } });

module.exports = upload;
