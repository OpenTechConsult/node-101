const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const fsPromises = require('node:fs/promises')
const EventEmitter = require('node:events')

const logEvents = require('../logEvents')

// define the port on which the web server will listen to
const PORT = process.env.PORT || 3500

class Emitter extends EventEmitter { }

// instantiate an emitter
const myEmitter = new Emitter()
myEmitter.on('log', (msg, fileName) => {
    logEvents(msg, fileName)
})

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : '')
        const data = (contentType === 'application/json') ? JSON.parse(rawData) : rawData
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        )
        response.end(
            (contentType === 'application/json') ? JSON.stringify(data) : data
        )
    } catch (err) {
        console.error(err)
        myEmitter.emit('log', `${err.name}\t${err.message}`, 'errLog.txt')
        response.status(500)
        response.end()
    }
}

// define the minimal server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method)
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

    const extension = path.extname(req.url)

    let contentType
    let filePath = ''

    switch (extension) {
        case '.css':
            contentType = 'text/css'
            break
        case '.js':
            contentType = 'text/javascript'
            break
        case '.json':
            contentType = 'application/json'
            break
        case '.jpg':
            contentType = 'image/jpeg'
            break
        case '.png':
            contentType = 'image/png'
            break
        case '.txt':
            contentType = 'text/plain'
            break
        default:
            contentType = 'text/html'
            break
    }

    if (contentType === 'text/html' && req.url === '/') {
        filePath = path.join(__dirname, 'views', 'index.html')
    } else if (contentType === 'text/html' && req.url.slice(-1) === '/') {
        filePath = path.join(__dirname, 'views', req.url, 'index.html')
    } else if (contentType === 'text/html') {
        filePath = path.join(__dirname, 'views', req.url)
    } else {
        filePath = path.join(__dirname, req.url)
    }

    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') {
        filePath += '.html'
    }

    // check if the file specified in the filePath exist or not
    const fileExists = fs.existsSync(filePath)

    if (fileExists) {
        serveFile(filePath, contentType, res)
    } else {

        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' })
                res.end()
                break
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' })
                res.end()
                break
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
        }
        console.log(path.parse(filePath))
    }
})

// launch the server by listening to the specified port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})