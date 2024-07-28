const config = require('../config/auth'); // Configuration for authentication, including secret key for JWT
const jwt = require('jsonwebtoken'); // Library for generating and verifying JSON Web Tokens (JWT)
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const User = require('../models/user'); // Model for user data
const { controllers: { users: STRINGS } = {} } = require('../MAGIC_STRINGS'); // Magic strings for user-related messages

// Public access endpoint
// Provides a public message, accessible to everyone
exports.allAccess = (req, res) => {
  res.status(200).json({
    isSuccess: true,
    message: STRINGS.publicContent // Message for public content
  });
};

// User access endpoint
// Provides user-specific content, accessible to authenticated users
exports.userAccess = (req, res) => {
  res.status(200).json({
    isSuccess: true,
    user: res.user, // User details from request
    message: 'User Content.' // Message for user-specific content
  });
};

// Admin access endpoint
// Provides admin-specific content, accessible to users with admin roles
exports.adminAccess = (req, res) => {
  res.status(200).json({
    isSuccess: true,
    message: STRINGS.adminContent // Message for admin content
  });
};

// Business access endpoint
// Provides business-specific content, accessible to users with business roles
exports.businessAccess = (req, res) => {
  res.status(200).json({
    isSuccess: true,
    message: STRINGS.businessContent // Message for business content
  });
};

// Change password endpoint
// Allows users to change their password
exports.changePassword = async (req, res) => {
  const { password, repassword } = req.body;

  // Check if the new passwords match
  if (password !== repassword) {
    return res.status(400).json({
      isSuccess: false,
      message: STRINGS.passwordAndRepasswordMustBeTheSame // Error message for mismatched passwords
    });
  }

  try {
    const { _id: id } = res.user; // Get the user ID from the request
    const user = await User.findById(id); // Find the user by ID

    // Hash the new password
    user.password = bcrypt.hashSync(password, 4);
    await user.save(); // Save the updated user

    // Generate a new JWT token
    const expiresIn = 86400; // Token expiration time (24 hours)
    const token = jwt.sign({ id }, config.secret, {
      expiresIn
    });

    res.status(200).json({
      isSuccess: true,
      data: token, // Return the new JWT token
      message: STRINGS.userUpdated // Success message for password change
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message // Error message for any issues during password change
    });
  }
};

// Update user profile endpoint
// Allows users to update their profile information
exports.updateProfile = async (req, res) => {
  try {
    const { roles } = req.body;
    // Convert role objects to their IDs
    req.body.roles = req.body.roles.map((role) => role._id);
    console.log('req.body :>> ', req.body); // Log the request body for debugging

    // Find and update the user profile
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId }, // Find user by ID from request
      req.body, // Update user data
      { new: true } // Return the updated user
    ).populate('roles'); // Populate roles with their details

    if (!updatedUser) {
      return res.status(404).json({
        isSuccess: false,
        message: 'User not found' // Error message if user not found
      });
    }

    res.status(200).json({
      isSuccess: true,
      data: {
        _id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        address: updatedUser.address,
        roles // User roles
      },
      message: 'User has been successfully updated!' // Success message for profile update
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message // Error message for any issues during profile update
    });
  }
};
