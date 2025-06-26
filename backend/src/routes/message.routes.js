const express = require('express')
const protectedRoute = require('../middleware/auth.middleware')
const { getUsers, getMessage, sendMessage } = require('../controllers/message.controller')

const router = express.Router()

router.use(protectedRoute)

router.get('/users', getUsers)
router.get('/:id', getMessage)
router.post('/send/:id', sendMessage)

module.exports = router