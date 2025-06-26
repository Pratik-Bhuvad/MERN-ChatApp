const dotenv = require('dotenv')

dotenv.config()

const requiredVars = [
    'PORT',
    'DB_URI',
    'JWT_SECRET',
    'NODE_ENV',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
]

const missingVars = requiredVars.filter((key) => !process.env[key])
if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
}

module.exports = {
    "PORT": process.env.PORT,
    "DB_URI": process.env.DB_URI,
    "JWT_SECRET": process.env.JWT_SECRET,
    "NODE_ENV": process.env.NODE_ENV || 'development',
    "CLOUD_NAME": process.env.CLOUDINARY_CLOUD_NAME,
    "CLOUDINARY_API_KEY": process.env.CLOUDINARY_API_KEY,
    "CLOUDINARY_API_SECRET": process.env.CLOUDINARY_API_SECRET
}