const { readFile, writeFile, appendFile, rename, unlink } = require('node:fs/promises')
const { join } = require('node:path')

const fileOps = async () => {
    try {
        const filePath = join(__dirname, 'files', 'starter.txt')
        const data = await readFile(filePath, { encoding: 'utf8' })
        console.log(data)
        await unlink(filePath)
        await writeFile(join(__dirname, 'files', 'promiseWrite.txt'), data)
        await appendFile(join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNice to meet you')
        await rename(join(__dirname, 'files', 'promiseWrite.txt'),
            join(__dirname, 'files', 'promiseComplete.txt'))
        const newData = await readFile(join(__dirname, 'files', 'promiseComplete.txt'),
            { encoding: 'utf8' })
        console.log(newData)
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

