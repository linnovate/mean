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
var app = {};
var db = mongoose.connect(config.db, function(err) {
    if (err) {
	console.error('Error:', err.message);
	return console.error('**Could not connect to MongoDB. Please ensure mongod is running and restart MEAN app.**');
    }

    // Bootstrap Models, Dependencies, Routes and the app as an express app
    app = require('./server/config/system/bootstrap')(passport, db);

    // Start the app by listening on <port>, optional hostname
    app.listen(config.port, config.hostname);
    console.log('MEAN app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');

    // Initializing logger
    logger.init(app, passport, mongoose);
});

// Expose app
exports = module.exports = app;
