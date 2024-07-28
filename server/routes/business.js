const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController'); // Controller for business actions
const {
  validateBusinessCreate,
  validateBusinessPut,
  validateBusinessPatch
} = require('../middlewares/validators'); // Middleware for business validation
const upload = require('../middlewares/upload'); // Multer configuration for file uploads

// Route to create a new business
router.post(
  '/',
  upload.array('images', 5), // Limit to 5 images
  validateBusinessCreate, // Validate business creation data
  businessController.createBusiness
);

// Route to update a business
router.put(
  '/:id',
  upload.array('images', 5), // Limit to 5 images
  validateBusinessPut, // Validate business update data
  businessController.updateBusiness
);

// Route to get all businesses
router.get('/', businessController.getBusinesses);

// Route to get businesses by distance
router.get('/near', businessController.getBusinessByDistance);

// Route to get a single business by ID
router.get('/:id', businessController.getBusinessById);

// Route to partially update a business
router.patch(
  '/:id',
  validateBusinessPatch, // Validate partial update data
  businessController.partialUpdateBusiness
);

// Route to delete a business by ID
router.delete('/:id', businessController.deleteBusiness);

// Export the router for use in the main router file
module.exports = router;
