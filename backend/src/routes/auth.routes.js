const express = require('express')
const { signUp, login, logout, checkAuth } = require('../controllers/auth.controller')
const  protectedRoute  = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/signUp', signUp)
router.post('/login', login)
router.post('/logout', logout)

router.get('/check', protectedRoute, checkAuth)

module.exports = router