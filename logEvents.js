const { existsSync } = require('node:fs')
const { appendFile, mkdir } = require('node:fs/promises')
const { join } = require('node:path')

const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    const logFile = join(__dirname, 'logs', logName)
    const logDir = join(__dirname, 'logs')
    console.log(logItem)
    try {
        if (!existsSync(logDir)) {
            await mkdir(logDir)
        }
        //
        await appendFile(logFile, logItem)
    } catch (err) {
        console.error(err)
    }
}

module.exports = logEvents