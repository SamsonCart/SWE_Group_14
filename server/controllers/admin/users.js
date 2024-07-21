const { response, user: UserClass } = require('../../classes');
const Role = require('../../models/role');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth');
const { controllers: { users: STRINGS } = {} } = require('../../MAGIC_STRINGS');

exports.getUser = async (req, res) => {
  try {
    const { _id, createdTime, email, isActive, roles, username } = res.user;
    response.successed(res, {
      _id,
      createdTime,
      email,
      isActive,
      roles,
      username
    });
  } catch (error) {
    res.status(200).json(new response.fail(error.message));
  }
};

exports.createUser = async (req, res) => {
  const { email, password, roles: roleIds, username } = req.body;
  const expiresIn = 86400; // 24 hours

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = new User({ email, password: hashedPassword, username });

    // Find roles by name
    const roles = await Role.find({ _id: { $in: roleIds } });
    // Assign role IDs to user
    roles.map((role) => user.roles.push(mongoose.Types.ObjectId(role._id)));
    await user.save();

    response.successed(
      res,
      {
        _id: user._id,
        email,
        roles,
        username: user.username,
        isActive: user.isActive,
        createdTime: user.createdTime
      },
      'User has been successfully created!'
    );
  } catch (error) {
    response.failed(res, error.message);
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
    let anyError = [];

    if (username && username.length < 4) {
      anyError.push('Username should be more than 4 characters.');
    }
    if (email && !UserClass.mail.validateEmail(email)) {
      anyError.push('Email address should be a valid email.');
    }
    if (password && password.length < 8) {
      anyError.push('Password should be more than 7 characters.');
    }

    if (anyError.length > 0) {
      return response.failed(res, anyError);
    }

    const updateData = {
      username,
      email,
      isActive
    };

    if (password) {
      updateData.password = bcrypt.hashSync(password, 8);
    }

    // Find roles by name and convert to ObjectId array
    if (roleIds && roleIds.length > 0) {
      const roles = await Role.find({ _id: { $in: roleIds } });
      updateData.roles = roles.map((role) => mongoose.Types.ObjectId(role._id));
    } else {
      anyError.push(STRINGS.rolesCanNotBeEmpty);
    }

    if (anyError.length > 0) {
      return response.failed(res, anyError);
    }

    const user = await User.findOneAndUpdate({ _id }, updateData, { new: true })
      .populate('roles')
      .select('-password');

    response.successed(
      res,
      {
        _id: user._id,
        email: user.email,
        roles: user.roles,
        username: user.username,
        isActive: user.isActive,
        createdTime: user.createdTime
      },
      'User has been successfully updated!'
    );
  } catch (error) {
    response.failed(res, error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;
    await User.deleteOne({ _id });
    response.successed(res, { _id }, STRINGS.userDeleted);
  } catch (error) {
    res.status(500).json(new response.fail(error.message));
  }
};
