const express = require('express');
const router = express.Router();

// Import models for User and Role
const Role = require('../../models/role');
const User = require('../../models/user');

// Import controllers for handling user-related actions
const controller = require('../../controllers/admin/users');
const { getGeneric } = require('../../controllers/generic');

// Import middleware functions
const {
  checkDuplicateUsernameOrEmail
} = require('../../middlewares/user/verifySignUp'); // Middleware for checking unique username or email
const dbQuery = require('../../middlewares/utils/dbQuery'); // Middleware for database queries with population
const authJwt = require('../../middlewares/user/authJwt'); // Middleware for JWT authentication and authorization

// Route to get all users, with roles populated and password excluded
router.route('/').get(
  dbQuery(User, [{ path: 'roles', select: 'name' }], ['password']), // Populate 'roles' field and exclude 'password'
  getGeneric // Handle GET request to retrieve users
);

// Route to create a new user, requires authentication and admin role
router.post(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin], // Ensure user is authenticated and has admin role
  [checkDuplicateUsernameOrEmail], // Ensure no duplicate username or email
  controller.createUser // Handle POST request to create a new user
);

// Route to get all roles
router.route('/roles').get(dbQuery(Role), getGeneric); // Handle GET request to retrieve roles

// Routes for specific user operations by ID
router
  .get('/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.getUser) // Retrieve a specific user by ID
  .put('/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.updateUser) // Update a specific user by ID
  .delete(
    '/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  ); // Delete a specific user by ID

// Export the router for use in the main router file
module.exports = router;
