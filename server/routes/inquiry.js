const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { validateInquiryCreate, validateInquiryUpdate } = require('../middlewares/validators');

// Create a new inquiry
router.post('/', validateInquiryCreate, inquiryController.createInquiry);

// Get all inquiries
router.get('/', inquiryController.getInquiries);

// Get a single inquiry by ID
router.get('/:id', inquiryController.getInquiryById);

// Update an inquiry
router.put('/:id', validateInquiryUpdate, inquiryController.updateInquiry);

// Delete an inquiry
router.delete('/:id', inquiryController.deleteInquiry);

// Business respond to inquiry
router.patch('/:id/response', inquiryController.respondToInquiry);

module.exports = router;
