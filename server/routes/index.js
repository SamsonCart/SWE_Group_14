const express = require('express');
const router = express.Router();

// Import route files
const businessRoutes = require('./business');
const serviceRoutes = require('./service');
const availabilityRoutes = require('./availability');
const adminRoutes = require('./admin');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const dashboardRoutes = require('./dashboard');

// Use routes
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/dashboard', dashboardRoutes);

router.use('/business', businessRoutes);
router.use('/service', serviceRoutes);
router.use('/availability', availabilityRoutes);

module.exports = router;
