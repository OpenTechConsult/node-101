const path = require('node:path')

const cors = require('cors')
const express = require('express')

const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const subDirRouter = require('./routes/subdir')
const rootRouter = require('./routes/root')
const employeeRouter = require('./routes/api/employees')


const PORT = process.env.PORT || 3500

const app = express()

//custom middleware logger
app.use(logger)

// Cross Origin Resource Sharing
const whitelist = ['https://www.google.com', 'http://127.0.0.1:5000', 'http://localhost:3500']
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data
// in other word, form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// serve static files
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/subdir', express.static(path.join(__dirname, 'public')))

app.use('/', rootRouter)
app.use('/subdir', subDirRouter)
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