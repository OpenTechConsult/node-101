const { mkdir } = require('node:fs')

const newDir = './new'
mkdir(newDir, (err) => {
    if (err) {
        throw err
    }
    console.log('Directory is created')
})