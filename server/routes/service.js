const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { validateServiceCreate, validateServicePut, validateServicePatch } = require('../middlewares/validators');


router.get('/:id', serviceController.getServiceById);

router.post('/', validateServiceCreate, serviceController.createService);
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', validateServicePut, serviceController.updateService);
router.patch('/:id', validateServicePatch, serviceController.partialUpdateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
