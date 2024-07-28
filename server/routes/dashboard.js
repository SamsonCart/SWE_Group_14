const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController'); // Controller for dashboard actions

// Route to get dashboard statistics
router.get('/stats', dashboardController.getStats);

// Export the router for use in the main router file
module.exports = router;
