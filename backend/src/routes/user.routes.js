const express = require('express')
const { updateProfile } = require('../controllers/user.controller')
const protectedRoute = require('../middleware/auth.middleware')

const router = express.Router()

router.put('/update', protectedRoute, updateProfile)

module.exports = router