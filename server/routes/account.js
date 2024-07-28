const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/user/authJwt'); // JWT authentication middleware
const accountController = require('../controllers/accountController'); // Controller for account-related actions
const { validateProfileUpdate } = require('../middlewares/validators'); // Validator middleware for profile updates

// Middleware to set CORS headers
router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// Authorization test routes
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

// User-related routes
router.put(
  '/changepassword',
  [authJwt.verifyToken],
  accountController.changePassword
);
router.put(
  '/update',
  [authJwt.verifyToken],
  validateProfileUpdate, // Validate profile update data
  accountController.updateProfile
);

// Export the router for use in the main router file
module.exports = router;
