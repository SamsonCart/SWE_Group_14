const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authJwt = require('../middlewares/user/authJwt');

router.get('/stats', dashboardController.getStats);
router.get(
  '/business',
  authJwt.verifyToken,
  dashboardController.getUserBusiness
);

module.exports = router;
