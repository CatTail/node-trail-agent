'use strict'

let spawn = require('child_process').spawn
let chai = require('chai')
let sinonChai = require('sinon-chai')
let dnode = require('dnode')

const DNODE_PORT = 6470
let proc = spawn('./resources/dnode.js', [DNODE_PORT], {stdio: 'inherit'})
let local

before((done) => {
    chai.use(sinonChai)
    connect(done)
})

after(() => {
    local.end()
})

function connect(done) {
    local = dnode.connect(DNODE_PORT)
    local.on('remote', function (remote) {
        global.remote = remote
        done()
    })
    // retry on server not started
    local.on('error', () => {
        setTimeout(connect.bind(null, done), 10)
    })
}

process.on('exit', () => {
    proc.kill('SIGTERM')
})
