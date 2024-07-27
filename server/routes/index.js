const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Multer configuration

const MAX_FILES = 10;

// Import route files
const adminRoutes = require('./admin');
const userRoutes = require('./user');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');

const businessRoutes = require('./business');
const serviceRoutes = require('./service');
const bookingRoutes = require('./booking'); // Add booking routes

// Use routes
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/business', businessRoutes);
router.use('/service', serviceRoutes);
router.use('/booking', bookingRoutes);

router.post('/upload', upload.array('images', MAX_FILES), (req, res) => {
  const filenames = req.files.map((file) => file.filename);
  res.status(200).send({ filenames });
});

module.exports = router;
