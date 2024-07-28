const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController'); // Controller for service actions
const {
  validateServiceCreate,
  validateServicePut,
  validateServicePatch
} = require('../middlewares/validators'); // Middleware for service validation

// Route to get a single service by ID
router.get('/:id', serviceController.getServiceById);

// Route to create a new service
router.post('/', validateServiceCreate, serviceController.createService);

// Route to get all services
router.get('/', serviceController.getServices);

// Route to update a service by ID
router.put('/:id', validateServicePut, serviceController.updateService);

// Route to partially update a service by ID
router.patch(
  '/:id',
  validateServicePatch,
  serviceController.partialUpdateService
);

// Route to delete a service by ID
router.delete('/:id', serviceController.deleteService);

// Export the router for use in the main router file
module.exports = router;
