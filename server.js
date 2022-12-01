require('dotenv').config()
const path = require('node:path')

// third party modules
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

// importing middlewares
const verifyJWT = require('./middleware/verifyJWT')
const { logger } = require('./middleware/logEvents')
const credentials = require('./middleware/credentials')
const errorHandler = require('./middleware/errorHandler')

// importing routers
const rootRouter = require('./routes/root')
const authRouter = require('./routes/auth')
const connectDB = require('./config/dbConn')
const logoutRouter = require('./routes/logout')
const refreshRouter = require('./routes/refresh')
const registerRouter = require('./routes/register')
const corsOptions = require('./config/corsOptions')
const employeeRouter = require('./routes/api/employees')


// constants
const PORT = process.env.PORT || 3500

// connect to MongoDB
connectDB()

const app = express()

//custom middleware logger
app.use(logger)

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials)

// cross origin resource sharing
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// serve static files
app.use('/', express.static(path.join(__dirname, 'public')))

// routing
app.use('/', rootRouter)
app.use('/register', registerRouter)
app.use('/auth', authRouter)
app.use('/refresh', refreshRouter)
app.use('/logout', logoutRouter)

app.use(verifyJWT)
app.use('/employees', employeeRouter)



app.all('/*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))

    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" })

    } else {
        res.type('txt').send("404 Not Found")
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
