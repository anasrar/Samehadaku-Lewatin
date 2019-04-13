#!/usr/bin/env node

require('babel-register')({
    presets: [ 'env' ]
})

// Import the rest of our application.
module.exports = require('./module/app')