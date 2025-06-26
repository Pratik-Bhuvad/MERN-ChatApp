const jwt = require('jsonwebtoken')
const {JWT_SECRET, NODE_ENV} = require('./env')

const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, JWT_SECRET, {
        expiresIn: '7d'
    })

    res.cookie("token", token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENV !== ' development'
    })
    return token
}

module.exports = generateToken