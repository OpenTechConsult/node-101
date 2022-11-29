const { mkdir, existsSync, rmdir } = require('node:fs')

const newDir = './new'

if (!existsSync(newDir)) {
    mkdir(newDir, (err) => {
        if (err) {
            throw err
        }
        console.log('Directory is created')
    })

}

if (existsSync(newDir)) {
    rmdir(newDir, (err) => {
        if (err) {
            throw err
        }
        console.log('Directory removed')
    })
}

