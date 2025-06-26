const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const generateToken = require('../lib/utils')

const signUp = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 charaters' })

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: 'Email already exists' })

        const salt = await bcrypt.genSalt(15)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                success: true, user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    avatar: newUser.avatar
                },
                message: 'Account Creation Successful'
            })
        } else {
            res.status(400).json({ success: false, message: 'Invalid User Data' })
        }
    } catch (error) {
        console.log("User Registration Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

const login = async (req, res) => {
    const { identifier, password } = req.body
    try {
        if (!identifier || !password) return res.status(400).json({ success: false, message: 'Each Field is required' })

        const user = await User.findOne({
            $or: [
                { email: identifier },
                { fullName: identifier }
            ]
        })
        if (!user) return res.status(400).json({ success: false, message: 'Not user Invalid Credentials' })
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect || password !== user.password) return res.status(400).json({ success: false, message: 'Invalid Credentials' })

        generateToken(user._id, res)

        res.status(200).json({
            success: true, user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar
            },
            message: 'Login Successful'
        })
    } catch (error) {
        console.log("User Login Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

const logout = (req, res) => {
    try {
        res.cookie('token', "", { maxAge: 0 })
        res.status(200).json({
            success: true,
            message: 'Logout Successful'
        })
    } catch (error) {
        console.log("User Logout Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("CheckAuth Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

module.exports = {
    signUp,
    login,
    logout,
    checkAuth
}