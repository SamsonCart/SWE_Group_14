const express = require('express')
const router = express.Router()
const controller = require('../controllers/dashboard')
const authJwt = require('../middlewares/user/authJwt')

router.get('/stats', controller.getStats)
router.get('/business', authJwt.verifyToken, controller.getUserBusiness)


module.exports = router
