const config = require('../config/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { controllers: { users: STRINGS } = {} } = require('../MAGIC_STRINGS');
const { response, user: UserClass } = require('../classes');
const mongoose = require('mongoose');

exports.allAccess = (req, res) => {
  response.successed(res, null, STRINGS.publicContent);
};

exports.userAccess = (req, res) => {
  response.successed(res, res.user, 'User Content.');
};

exports.adminAccess = (req, res) => {
  response.successed(res, null, STRINGS.adminContent);
};

exports.businessAccess = (req, res) => {
  response.successed(res, null, STRINGS.businessContent);
};

exports.changePassword = async (req, res) => {
  const { password, repassword } = req.body;
  let error;

  if (password !== repassword) {
    error = STRINGS.passwordAndRepasswordMustBeTheSame;
  }

  if (error) {
    response.failed(res, error);
  } else {
    const { _id: id } = res.user;
    const user = await User.findById(id);

    user.password = bcrypt.hashSync(password, 4);
    await user.save();

    const expiresIn = 86400; // 24 hours
    const token = jwt.sign({ id }, config.secret, {
      expiresIn
    });

    response.successed(res, token, STRINGS.userUpdated);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, roles } = req.body;
    let anyError = [];

    /**
     * Todo: Integrate yup for validation
     */
    if (username && username.length < 4) {
      anyError.push('Username should be more than 4 characters.');
    }
    if (email && !UserClass.mail.validateEmail(email)) {
      anyError.push('Email address should be a valid email.');
    }
    if (!roles || roles.length === 0) {
      anyError.push(STRINGS.rolesCanNotBeEmpty);
    } else {
      res.user.roles = roles.map((role) => mongoose.Types.ObjectId(role._id));
    }
    if (anyError.length > 0) {
      return response.failed(res, anyError);
    }

    if (username && username !== res.user.username) {
      res.user.username = username;
    }
    if (email && email !== res.user.email) {
      res.user.email = email;
    }
    res.user.roles = roles;

    await res.user.save();
    await res.user.populate('roles');

    response.successed(
      res,
      { _id: res.user._id, email, username, roles },
      'User has been successfully updated!'
    );
  } catch (error) {
    response.failed(res, error.message);
  }
};
