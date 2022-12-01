const path = require('node:path')

const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')

const { logger } = require('./middleware/logEvents')
const credentials = require('./middleware/credentials')
const corsOptions = require('./config/corsOptions')
const errorHandler = require('./middleware/errorHandler')
const rootRouter = require('./routes/root')
const employeeRouter = require('./routes/api/employees')
const registerRouter = require('./routes/register')
const authRouter = require('./routes/auth')
const verifyJWT = require('./middleware/verifyJWT')
const refreshRouter = require('./routes/refresh')
const logoutRouter = require('./routes/logout')


const PORT = process.env.PORT || 3500

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))