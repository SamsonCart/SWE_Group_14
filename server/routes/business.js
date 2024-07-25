const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business');
const { validateBusinessCreate, validateBusinessPut, validateBusinessPatch } = require('../middlewares/validators');


router.post('/', validateBusinessCreate, businessController.createBusiness);
router.get('/', businessController.getBusinesses);
router.get('/:id', businessController.getBusinessById);
router.put('/:id', validateBusinessPut, businessController.updateBusiness);
router.patch('/:id', validateBusinessPatch, businessController.partialUpdateBusiness);
router.delete('/:id', businessController.deleteBusiness);

module.exports = router;
