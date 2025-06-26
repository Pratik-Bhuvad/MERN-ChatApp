const express = require('express')
const cookieParser = require('cookie-parser')
const { PORT, NODE_ENV } = require('./lib/env')
const cors = require('cors')

const { app, server } = require('./lib/socket')

// Global error handlers for production safety
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err)
    process.exit(1)
})

// Connection to the Database
const connectDB = require('./lib/db')
connectDB();

const path = require('path')
const _dirname = path.resolve()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// Importing Routes
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const messageRoutes = require('./routes/message.routes')

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)

if (NODE_ENV === 'production') {
    app.use(express.static(path.join(_dirname, '../frontend/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"))
    })
}

server.listen(PORT, () => {
    console.log('Server is running on port 5000')
})