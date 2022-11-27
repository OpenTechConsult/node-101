const { readFile, writeFile } = require('node:fs/promises')
const { join } = require('node:path')

const fileOps = async () => {
    try {
        const filePath = join(__dirname, 'files', 'starter.txt')
        const data = await readFile(filePath, { encoding: 'utf8' })
        console.log(data)
        await writeFile(join(__dirname, 'files', 'promiseWrite.txt'), data)
    } catch (err) {
        console.error(err)
    }
}

fileOps()


// exit on uncaught errors
process.on('uncaughtException', err => {
    console.log(`There was an uncaught error: ${err}`)
    process.exit(1)
})

