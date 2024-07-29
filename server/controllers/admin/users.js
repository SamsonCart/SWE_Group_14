const Role = require('../../models/role'); // Model for user roles
const User = require('../../models/user'); // Model for user data
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const mongoose = require('mongoose'); // MongoDB object modeling tool
const { controllers: { users: STRINGS } = {} } = require('../../MAGIC_STRINGS'); // Magic strings for user-related messages

// Helper function to validate email format
// Uses a regular expression to check if the email is valid
const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().select('id name');
    res.status(200).json({
      isSuccess: true,
      data: roles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'username';
  const filter = req.query.filter || {};

  // Initialize filter object
  const filterObj = {};

  // Check if username filter exists
  if (filter.username) {
    filterObj.username = { $regex: filter.username, $options: 'i' }; // Case-insensitive search
  }

  // Check if email filter exists
  if (filter.email) {
    filterObj.email = { $regex: filter.email, $options: 'i' }; // Case-insensitive search
  }

  // Check if roles filter exists
  if (filter.roles) {
    filterObj.roles = { $in: filter.roles }; // Filter by roles
  }

  // Check if isActive filter exists
  if (filter.isActive !== undefined) {
    filterObj.isActive = filter.isActive;
  }

  try {
    const users = await User.find(filterObj)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password')
      .populate('roles')
      .exec();

    const count = await User.countDocuments(filterObj);
    res.status(200).json({
      isSuccess: true,
      data: {
        items: users,
        total: count
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user details by ID
// Responds with user data including _id, createdTime, email, isActive, roles, and username
exports.getUser = async (req, res) => {
  try {
    const { _id, createdTime, email, isActive, roles, username } = res.user;
    res.status(200).json({
      isSuccess: true,
      data: {
        _id,
        createdTime,
        email,
        isActive,
        roles,
        username
      }
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message
    });
  }
};

// Create a new user
// Hashes the password, assigns roles, and saves the user to the database
exports.createUser = async (req, res) => {
  const { email, password, roles: roleIds, username } = req.body;

  try {
    // Hash the password with bcrypt
    const hashedPassword = bcrypt.hashSync(password, 4);
    const user = new User({ email, password: hashedPassword, username });

    // Find roles by their IDs and assign them to the user
    const roles = await Role.find({ _id: { $in: roleIds } });
    roles.map((role) => user.roles.push(mongoose.Types.ObjectId(role._id)));
    await user.save();

    res.status(201).json({
      isSuccess: true,
      data: {
        _id: user._id,
        email,
        roles,
        username: user.username,
        isActive: user.isActive,
        createdTime: user.createdTime
      },
      message: 'User has been successfully created!'
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message
    });
  }
};

// Update user details
// Validates input, hashes password if provided, and updates user in the database
exports.updateUser = async (req, res) => {
  try {
    const {
      _id,
      username,
      email,
      isActive,
      password,
      roles: roleIds
    } = req.body;
    let errors = [];

    // Validate input fields
    if (username && username.length < 4) {
      errors.push('Username should be more than 4 characters.');
    }
    if (email && !validateEmail(email)) {
      errors.push('Email address should be a valid email.');
    }
    if (password && password.length < 8) {
      errors.push('Password should be more than 7 characters.');
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        errors: errors
      });
    }

    const updateData = {
      username,
      email,
      isActive
    };

    // Hash the password if provided
    if (password) {
      updateData.password = bcrypt.hashSync(password, 4);
    }

    // Find roles by IDs and update the user's roles
    if (roleIds && roleIds.length > 0) {
      const roles = await Role.find({ _id: { $in: roleIds } });
      updateData.roles = roles.map((role) => mongoose.Types.ObjectId(role._id));
    } else {
      errors.push(STRINGS.rolesCanNotBeEmpty);
    }

    // Return errors if any
    if (errors.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        errors: errors
      });
    }

    // Update the user and respond with the updated data
    const user = await User.findOneAndUpdate({ _id }, updateData, { new: true })
      .populate('roles') // Populate roles with their details
      .select('-password'); // Exclude password from response

    res.status(200).json({
      isSuccess: true,
      data: {
        _id: user._id,
        email: user.email,
        roles: user.roles,
        username: user.username,
        isActive: user.isActive,
        createdTime: user.createdTime
      },
      message: 'User has been successfully updated!'
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message
    });
  }
};

// Delete a user by ID
// Removes the user from the database
exports.deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({
      isSuccess: true,
      data: { _id: req.params.id },
      message: STRINGS.userDeleted
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message
    });
  }
};
