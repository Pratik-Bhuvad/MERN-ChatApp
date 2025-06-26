const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { JWT_SECRET } = require('../lib/env')

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' })

        const decoded = jwt.verify(token, JWT_SECRET)
        if (!decoded) return res.status(401).json({ success: false, message: 'Unauthorized' })

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) return res.status(404).json({ success: false, message: 'No user found' })
        req.user = user
        next()
    } catch (error) {
        console.log("ProtectedRoute Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

module.exports = protectedRoute