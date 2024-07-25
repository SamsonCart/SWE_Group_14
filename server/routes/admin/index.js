const express = require('express')
const router = express.Router()
const authJwt = require('../../middlewares/user/authJwt')

router.use(authJwt.verifyToken)
router.use(authJwt.isAdmin)

router.use('/users', require('./users'))
router.use('/homepage', require('../dashboard'))
router.use('/check', require('./check'))

module.exports = router
