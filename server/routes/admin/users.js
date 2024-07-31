const express = require('express');
const router = express.Router();

// Import models for User and Role
const Role = require('../../models/role');
const User = require('../../models/user');

// Import controllers for handling user-related actions
const userController = require('../../controllers/admin/userController');

// Import middleware functions
const {
  checkDuplicateUsernameOrEmail
} = require('../../middlewares/user/verifySignUp'); // Middleware for checking unique username or email
const authJwt = require('../../middlewares/user/authJwt'); // Middleware for JWT authentication and authorization

// Route to get the list of roles, requires authentication and admin role
router.get(
  '/roles',
  [authJwt.verifyToken, authJwt.isAdmin], // Ensure user is authenticated and has admin role
  userController.getRoles
);

// Route to get the list of users, requires authentication and admin role
router.get(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin], // Ensure user is authenticated and has admin role
  userController.getUsers
);

// Route to create a new user, requires authentication and admin role
router.post(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin], // Ensure user is authenticated and has admin role
  [checkDuplicateUsernameOrEmail], // Ensure no duplicate username or email
  userController.createUser // Handle POST request to create a new user
);

// Routes for specific user operations by ID
router
  .get('/:id', [authJwt.verifyToken, authJwt.isAdmin], userController.getUser) // Retrieve a specific user by ID
  .put('/:id', [authJwt.verifyToken, authJwt.isAdmin], userController.updateUser) // Update a specific user by ID
  .delete(
    '/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.deleteUser
  ); // Delete a specific user by ID

// Export the router for use in the main router file
module.exports = router;
