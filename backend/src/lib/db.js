const mongoose = require('mongoose')
const { DB_URI } = require('./env')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(DB_URI)
        console.log(`DB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("DB Connection Error: ", error.message)
    }
}

module.exports = connectDB