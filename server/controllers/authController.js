const config = require('../config/auth'); // Authentication configuration, including JWT secret
const Role = require('../models/role'); // Model for user roles
const User = require('../models/user'); // Model for user data
const { response } = require('../classes'); // Custom response handler
const { controllers: { auth: STRINGS } = {} } = require('../MAGIC_STRINGS'); // Magic strings for authentication messages
const { randomInt } = require('node:crypto'); // Utility for generating random integers

var jwt = require('jsonwebtoken'); // Library for creating and verifying JSON Web Tokens
var bcrypt = require('bcryptjs'); // Library for hashing and comparing passwords

// User signup handler
exports.signup = async (req, res) => {
  const { email, password, roles, username } = req.body;
  const expiresIn = 86400; // Token expiration time (24 hours)

  try {
    // Generate a unique authentication code
    const authCode =
      randomInt(1000_000_000).toString().padStart(12, '0') +
      randomInt(1000_000_000).toString().padStart(12, '0');

    // Create a new user instance
    const user = new User({
      authCode,
      email,
      password: bcrypt.hashSync(password, 4), // Hash the password
      username
    });

    // Save the new user
    await user.save(async (err, user) => {
      if (err) {
        return res.status(200).send(new response.fail(err)); // Handle save errors
      }

      // Find and assign the 'customer' role
      Role.findOne({ name: 'customer' }, async (err, role) => {
        if (err) {
          return res.status(200).send(new response.fail(err)); // Handle role lookup errors
        }

        user.roles = [role];
        await user.save((err, user) => {
          if (err) {
            return res.status(200).send(new response.fail(err)); // Handle role assignment errors
          }

          // Generate a JWT token for the user
          const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn
          });
          res.status(200).send(
            new response.success({
              id: user._id,
              email,
              roles: user.roles,
              username: user.username,
              accessToken: token
            })
          );
        });
      });
    });
  } catch (error) {
    console.log(error.message); // Log errors
  }
};

// User signin handler
exports.signin = (req, res) => {
  User.findOne({
    $or: [
      { username: req.body?.username },
      { email: req.body?.username },
      { username: req.body?.email },
      { email: req.body?.email }
    ]
  })
    .populate('roles', '-__v') // Exclude version field from roles
    .exec((err, user) => {
      if (err) {
        return res.status(200).send(new response.fail(err)); // Handle lookup errors
      }

      if (!user) {
        return response.failed(
          res,
          `${STRINGS.userNotFound} or ${STRINGS.invalidPassword}` // Handle invalid credentials
        );
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return response.failed(
          res,
          `${STRINGS.userNotFound} or ${STRINGS.invalidPassword}` // Handle invalid password
        );
      }

      let expiresIn = 86400; // Token expiration time (24 hours)

      if (req.body.remember === true) {
        expiresIn *= 100; // Extend expiration to 100 days
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn
      });

      res.status(200).send(
        new response.success({
          id: user._id,
          email: user.email,
          roles: user.roles,
          username: user.username,
          firstname: user?.firstname,
          lastname: user?.lastname,
          address: user?.address,
          accessToken: token
        })
      );
    });
};

// JWT signin handler (used for refreshing tokens)
exports.jwtSignin = async (req, res) => {
  if (req.userId) {
    try {
      const user = await User.findById(req.userId)
        .populate('roles', '-__v') // Exclude version field from roles
        .select('-password'); // Exclude password field

      if (!user) {
        return response.failed(res, STRINGS.userNotFound); // Handle user not found
      }

      let expiresIn = 86400; // Token expiration time (24 hours)

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn
      });

      res.status(200).send(
        new response.success({
          id: user._id,
          email: user.email,
          roles: user.roles,
          username: user.username,
          firstname: user?.firstname,
          lastname: user?.lastname,
          address: user?.address,
          accessToken: token
        })
      );
    } catch (err) {
      return res.status(500).send(new response.fail(err.message)); // Handle server errors
    }
  } else {
    return response.failed(res, STRINGS.userNotFound); // Handle missing user ID
  }
};

// Account activation handler
exports.activate = async (req, res) => {
  const { email, authCode } = req.body;

  try {
    await User.findOne({ email }, async (err, user) => {
      if (err) {
        return res.status(200).send(new response.fail(err)); // Handle lookup errors
      }

      if (!user || user.authCode !== authCode) {
        return response.failed(
          res,
          `${STRINGS.userNotFound} / ${STRINGS.invalidAuthCode}` // Handle invalid activation code
        );
      }

      user.authCode = null;

      await user.save((err) => {
        if (err) {
          return res.status(200).send(new response.fail(err)); // Handle save errors
        }
        return res.status(200).send(STRINGS.userActivated); // Handle successful activation
      });
    });
  } catch (error) {
    console.log(error.message); // Log errors
  }
};
