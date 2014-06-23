'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    logger = require('mean-logger');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./server/config/config');
var db = mongoose.connect(config.db);
var conn = mongoose.connection;
conn.on('error', console.log.bind(console, '**Could not connect to MongoDB. Please ensure mongod is running and restart MEAN app.**\n'));

// Bootstrap Models, Dependencies, Routes and the app as an express app
var app = require('./server/config/system/bootstrap')(passport, db);

// Start the app by listening on <port>, optional hostname
conn.once('open', function() {
    app.listen(config.port, config.hostname);
    console.log('MEAN app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');

    // Initializing logger
    logger.init(app, passport, mongoose);
});

// Expose app
exports = module.exports = app;
