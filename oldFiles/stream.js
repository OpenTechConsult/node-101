const { createReadStream, createWriteStream } = require('node:fs')
const { join } = require('node:path')

const filePath = join(__dirname, 'files', 'lorem.txt')
const rs = createReadStream(filePath, { encoding: 'utf8' })

const newFilePath = join(__dirname, 'files', 'newLorem.txt')
const ws = createWriteStream(newFilePath)

// rs.on('data', (dataChunk) => {
//     ws.write(dataChunk)
// })

rs.pipe(ws)

