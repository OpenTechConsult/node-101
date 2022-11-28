const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const fsPromises = require('node:fs/promises')
const EventEmitter = require('node:events')

// define the port on which the web server will listen to
const PORT = process.env.PORT || 3500

class Emitter extends EventEmitter { }

// instantiate an emitter
const myEmitter = new Emitter()

// define the minimal server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method)

    let filePath

    switch (req.url) {
        case '/':
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            filePath = path.join(__dirname, 'views', 'index.html')
            fs.readFile(filePath, 'utf8', (err, data) => {
                res.end(data)
            })
            break

        default:
            break
    }

})

// launch the server by listening to the specified port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})