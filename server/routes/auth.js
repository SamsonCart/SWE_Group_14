const express = require('express');
const router = express.Router();
const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
} = require('../middlewares/user/verifySignUp');
const controller = require('../controllers/auth');
const authJwt = require('../middlewares/user/authJwt');

router.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.post('/activate', controller.activate);
router.post(
  '/signup',
  [checkDuplicateUsernameOrEmail, checkRolesExisted],
  controller.signup
);
router.post('/signin', controller.signin);
router.post('/jwtsignin', authJwt.verifyToken, controller.jwtSignin);

module.exports = router;
