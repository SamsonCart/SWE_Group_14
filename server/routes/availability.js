const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availability');
const { validateAvailabilityCreate, validateAvailabilityPut, validateAvailabilityPatch } = require('../middlewares/validators');

router.post('/', validateAvailabilityCreate, availabilityController.createAvailability);
router.get('/', availabilityController.getAvailabilities);
router.get('/:id', availabilityController.getAvailabilityById);
router.put('/:id', validateAvailabilityPut, availabilityController.updateAvailability);
router.patch('/:id', validateAvailabilityPatch, availabilityController.partialUpdateAvailability);
router.delete('/:id', availabilityController.deleteAvailability);

module.exports = router;
