const multer = require('multer'); // Multer for handling file uploads
const path = require('path'); // Path module (not used here, but useful for future use)
const fs = require('fs'); // File system module

// Directories for temporary and live storage
const TEMP_DIR = 'uploads/temp';
const LIVE_DIR = 'uploads/images';
const MAX_FILES = 10; // Maximum number of files allowed per upload

// Create the necessary directories if they don't exist
const createDirectories = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true }); // Create TEMP_DIR if it does not exist
  }
  if (!fs.existsSync(LIVE_DIR)) {
    fs.mkdirSync(LIVE_DIR, { recursive: true }); // Create LIVE_DIR if it does not exist
  }
};

createDirectories(); // Ensure directories are created before handling uploads

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR); // Store files temporarily in TEMP_DIR
  },
  filename: function (req, file, cb) {
    // Generate a unique filename by prefixing with timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { files: MAX_FILES, fieldSize: 1048576 * 2 } // Limit file count and size
});

module.exports = upload; // Export the configured upload middleware
