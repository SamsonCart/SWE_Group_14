const express = require('express');
const router = express.Router();
const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
} = require('../middlewares/user/verifySignUp'); // Middleware for sign-up validations
const controller = require('../controllers/authController'); // Controller for authentication actions
const authJwt = require('../middlewares/user/authJwt'); // JWT authentication middleware

// Middleware to set CORS headers
router.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// Authentication routes
router.post('/activate', controller.activate);
router.post(
  '/signup',
  [checkDuplicateUsernameOrEmail, checkRolesExisted], // Validate sign-up data
  controller.signup
);
router.post('/signin', controller.signin);
router.post('/jwtsignin', authJwt.verifyToken, controller.jwtSignin); // JWT sign-in route

// Export the router for use in the main router file
module.exports = router;
