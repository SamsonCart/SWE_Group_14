const { response } = require('../../classes'); // Custom response class
const ROLES = require('../../models/role'); // Role model
const User = require('../../models/user'); // User model

// Middleware to check for duplicate usernames or emails
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const { email, username } = req.body;

  try {
    // Check for existing username
    const userByUsername = await User.findOne({ username }).exec();
    if (userByUsername) {
      return res
        .status(200)
        .send(new response.fail('Failed! Username is already in use!'));
    }

    // Check for existing email
    const userByEmail = await User.findOne({ email }).exec();
    if (userByEmail) {
      return res
        .status(200)
        .send(new response.fail('Failed! Email is already in use!'));
    }

    next();
  } catch (err) {
    return res.status(200).send({ message: err.message });
  }
};

// Middleware to check if provided roles exist
checkRolesExisted = async (req, res, next) => {
  const { roles } = req.body;

  if (roles) {
    for (const item of roles) {
      try {
        const role = await ROLES.findOne({ name: item }).exec();
        if (!role) {
          return res
            .status(400)
            .send({ message: `Failed! Role ${item} does not exist!` });
        }
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
