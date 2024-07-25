const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/user/authJwt');
const accountController = require('../controllers/accountController');

// Middleware for setting headers
router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// Test routes for authorization
router.get('/test/all', accountController.allAccess);
router.get('/test/user', [authJwt.verifyToken], accountController.userAccess);
router.get(
  '/test/business',
  [authJwt.verifyToken, authJwt.isBusiness],
  accountController.businessAccess
);
router.get(
  '/test/admin',
  [authJwt.verifyToken, authJwt.isAdmin],
  accountController.adminAccess
);

// User routes
router.put(
  '/changepassword',
  [authJwt.verifyToken],
  accountController.changePassword
);
router.put('/update', [authJwt.verifyToken], accountController.updateProfile);

module.exports = router;
