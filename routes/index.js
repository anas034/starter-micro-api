const express = require('express')

const router = express.Router()
const user_auth = require('./user')
const admin_auth = require('./admin')
const institute = require('./institute_management')



router.use('/user', user_auth)
router.use('/admin', admin_auth)
router.use('/institute', institute)




module.exports = router