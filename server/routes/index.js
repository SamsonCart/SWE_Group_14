const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Multer configuration for file uploads

const MAX_FILES = 10; // Maximum number of files allowed for upload

// Import route files
const adminRoutes = require('./admin');
const accountRoutes = require('./account');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const businessRoutes = require('./business');
const serviceRoutes = require('./service');
const bookingRoutes = require('./booking'); // Routes for booking management

// Register route handlers with base paths
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/business', businessRoutes);
router.use('/service', serviceRoutes);
router.use('/booking', bookingRoutes);

// Route for handling file uploads
router.post('/upload', upload.array('images', MAX_FILES), (req, res) => {
  // Extract filenames from uploaded files
  const filenames = req.files.map((file) => file.filename);
  res.status(200).send({ filenames });
});

// Export the router for use in the main server file
module.exports = router;
