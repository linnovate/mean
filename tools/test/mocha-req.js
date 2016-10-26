'use strict'

process.env.NODE_ENV = 'test'
var path = require('path')
var appRoot = path.join(__dirname, '/../../')
require(appRoot + 'server.js')
require('meanio/lib/core_modules/module/util').preload(appRoot + '/packages/**/server', 'model')
