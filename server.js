const path = require('node:path')

const express = require('express')

const PORT = process.env.PORT || 3500

const app = express()

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})


app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html')
})

// chaining handler functions
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html')
    next()
}, (err, res) => {
    res.send('Hello World')
})

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))