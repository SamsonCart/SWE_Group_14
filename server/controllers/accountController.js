const config = require('../config/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { controllers: { users: STRINGS } = {} } = require('../MAGIC_STRINGS');
const mongoose = require('mongoose');

exports.allAccess = (req, res) => {
  res.status(200).json({
    isSuccess: true,
    message: STRINGS.publicContent
  });
};

exports.userAccess = (req, res) => {
  res.status(200).json({
    isSuccess: true,
    user: res.user,
    message: 'User Content.'
  });
};

exports.adminAccess = (req, res) => {
  res.status(200).json({
    isSuccess: true,
    message: STRINGS.adminContent
  });
};

exports.businessAccess = (req, res) => {
  res.status(200).json({
    isSuccess: true,
    message: STRINGS.businessContent
  });
};

exports.changePassword = async (req, res) => {
  const { password, repassword } = req.body;

  if (password !== repassword) {
    return res.status(400).json({
      isSuccess: false,
      message: STRINGS.passwordAndRepasswordMustBeTheSame
    });
  }

  try {
    const { _id: id } = res.user;
    const user = await User.findById(id);

    user.password = bcrypt.hashSync(password, 4);
    await user.save();

    const expiresIn = 86400; // 24 hours
    const token = jwt.sign({ id }, config.secret, {
      expiresIn
    });

    res.status(200).json({
      isSuccess: true,
      data: token,
      message: STRINGS.userUpdated
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, roles } = req.body;
    let errors = [];

    /**
     * Todo: Integrate yup for validation
     */
    if (username && username.length < 4) {
      errors.push('Username should be more than 4 characters.');
    }
    if (email && !validateEmail(email)) {
      // Assuming validateEmail is defined elsewhere
      errors.push('Email address should be a valid email.');
    }
    if (errors.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        errors: errors
      });
    }

    if (username && username !== res.user.username) {
      res.user.username = username;
    }
    if (email && email !== res.user.email) {
      res.user.email = email;
    }

    await res.user.save();
    await res.user.populate('roles');

    res.status(200).json({
      isSuccess: true,
      data: { _id: res.user._id, email, username, roles },
      message: 'User has been successfully updated!'
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message
    });
  }
};

// Helper function to validate email
const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};
