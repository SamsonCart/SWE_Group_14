const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/user/authJwt');
const controller = require('../controllers/user');

// Middleware for setting headers
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  next();
});

// Test routes for authorization
router.get('/test/all', controller.allAccess);
router.get('/test/user', [authJwt.verifyToken], controller.userAccess);
router.get('/test/business', [authJwt.verifyToken, authJwt.isBusiness], controller.businessAccess);
router.get('/test/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminAccess);

// User routes
router.put('/changepassword', [authJwt.verifyToken], controller.changePassword);
router.put('/update', [authJwt.verifyToken], controller.updateProfile);

module.exports = router;
