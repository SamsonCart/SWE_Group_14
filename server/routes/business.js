const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const {
  validateBusinessCreate,
  validateBusinessPut,
  validateBusinessPatch
} = require('../middlewares/validators');
const upload = require('../middlewares/upload');

router.post(
  '/',
  upload.array('images', 5),
  validateBusinessCreate,
  businessController.createBusiness
);
router.put(
  '/:id',
  upload.array('images', 5),
  validateBusinessPut,
  businessController.updateBusiness
);

router.get('/', businessController.getBusinesses);
router.get('/:id', businessController.getBusinessById);
router.patch(
  '/:id',
  validateBusinessPatch,
  businessController.partialUpdateBusiness
);
router.delete('/:id', businessController.deleteBusiness);

module.exports = router;
