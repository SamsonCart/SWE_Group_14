const express = require('express');
const router = express.Router();
const Role = require('../../models/role');
const User = require('../../models/user');
const controller = require('../../controllers/admin/users');
const { getGeneric } = require('../../controllers/generic');
const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
} = require('../../middlewares/user/verifySignUp');
const dbQuery = require('../../middlewares/utils/dbQuery');
const authJwt = require('../../middlewares/user/authJwt');

router
  .route('/')
  .get(
    dbQuery(User, [{ path: 'roles', select: 'name' }], ['password']),
    getGeneric
  );

router.post(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  [checkDuplicateUsernameOrEmail],
  controller.createUser
);

router.route('/roles').get(dbQuery(Role), getGeneric);

router
  .get('/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.getUser)
  .put('/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.updateUser)
  .delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);

module.exports = router;
