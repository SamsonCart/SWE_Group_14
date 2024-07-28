const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config/auth'); // Configuration for JWT secret
const Role = require('../../models/role'); // Role model
const User = require('../../models/user'); // User model
const { response } = require('../../classes'); // Custom response class
const {
  middlewares: { user: { authJWT: STRINGS } } = {}
} = require('../../MAGIC_STRINGS'); // Constants for string messages

// Middleware to set headers for CORS
router.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// Middleware to verify JWT token
verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(200).send(new response.fail(STRINGS.noToken));
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(200).send(new response.fail(STRINGS.unauthorized));
    }

    req.userId = decoded.id;
    try {
      const user = await User.findById(decoded.id);
      if (user) {
        res.user = user; // Store user in response for later use
      }
    } catch (error) {
      return res.status(500).send(new response.fail(error.message));
    }

    next();
  });
};

// Middleware to check if user has an 'admin' role
isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send(new response.fail(err.message));
      return;
    }

    if (user?.roles) {
      Role.find({ _id: { $in: user.roles } }, (err, roles) => {
        if (err) {
          res.status(500).send(new response.fail(err.message));
          return;
        }

        if (roles.some((role) => role.name === 'admin')) {
          next();
        } else {
          response.failed(res, STRINGS.requireAdmin);
        }
      });
    } else {
      res.status(403).send(new response.fail(STRINGS.requireAdmin));
    }
  });
};

// Middleware to check if user has a 'business' role
isBusiness = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send(new response.fail(err.message));
      return;
    }

    Role.find({ _id: { $in: user.roles } }, (err, roles) => {
      if (err) {
        res.status(500).send(new response.fail(err.message));
        return;
      }

      if (roles.some((role) => role.name === 'business')) {
        next();
      } else {
        res.status(403).send(new response.fail('Require Business Role!'));
      }
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isBusiness
};

module.exports = authJwt;
