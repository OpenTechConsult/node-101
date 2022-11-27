console.log('Hello World!')

// console.log(global)

// Common core module
const os = require('os')
const path = require('path')
// const { add, sub, mul, div } = require('./math')

console.log(os.type())
console.log(os.version())
console.log(os.homedir())

console.log(__dirname)
console.log(__filename)



console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))
console.log(path.parse(__filename))

// console.log(add(2, 3))
// console.log(sub(2, 3))
// console.log(mul(2, 3))
// console.log(div(2, 3))