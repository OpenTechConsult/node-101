const EventEmitter = require('events')

const logEvents = require('./logEvents')

class MyEmitter extends EventEmitter { }

// initialize object
const myEmitter = new MyEmitter()

// add a listener for the log event
myEmitter.on('log', (msg) => {
    logEvents(msg)
})

// emit the event after a certain period of time
setTimeout(() => {
    myEmitter.emit('log', 'Log event emitted')
}, 2000)
