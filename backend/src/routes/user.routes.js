const express = require('express')
const { updateProfile, getContacts, addContact, findUserByEmail } = require('../controllers/user.controller')
const protectedRoute = require('../middleware/auth.middleware')

const router = express.Router()

router.get('/findUserByEmail',protectedRoute, findUserByEmail)
router.put('/update', protectedRoute, updateProfile)
router.get('/contacts', protectedRoute, getContacts)
router.post('/contacts', protectedRoute, addContact)

module.exports = router