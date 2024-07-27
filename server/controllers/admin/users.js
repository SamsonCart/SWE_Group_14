const Role = require('../../models/role');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth');
const { controllers: { users: STRINGS } = {} } = require('../../MAGIC_STRINGS');

// Helper function to validate email
const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

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

exports.createUser = async (req, res) => {
  const { email, password, roles: roleIds, username } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 4);
    const user = new User({ email, password: hashedPassword, username });

    // Find roles by name
    const roles = await Role.find({ _id: { $in: roleIds } });
    // Assign role IDs to user
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

    if (username && username.length < 4) {
      errors.push('Username should be more than 4 characters.');
    }
    if (email && !validateEmail(email)) {
      errors.push('Email address should be a valid email.');
    }
    if (password && password.length < 8) {
      errors.push('Password should be more than 7 characters.');
    }

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

    if (password) {
      updateData.password = bcrypt.hashSync(password, 4);
    }

    // Find roles by name and convert to ObjectId array
    if (roleIds && roleIds.length > 0) {
      const roles = await Role.find({ _id: { $in: roleIds } });
      updateData.roles = roles.map((role) => mongoose.Types.ObjectId(role._id));
    } else {
      errors.push(STRINGS.rolesCanNotBeEmpty);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        errors: errors
      });
    }

    const user = await User.findOneAndUpdate({ _id }, updateData, { new: true })
      .populate('roles')
      .select('-password');

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
