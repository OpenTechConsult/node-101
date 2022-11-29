const path = require('node:path')

const express = require('express')

const PORT = process.env.PORT || 3500

const app = express()

app.get('/', (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname})
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))