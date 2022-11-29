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

// chaining route handlers
const one = (req, res, next) => {
    console.log('one')
    next()
}

const two = (req, res, next) => {
    console.log('two')
    next()
}

const three = (req, res, next) => {
    console.log('three')
    res.send('finished')
}


app.get('/chain(.html)?', [one, two, three])

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))