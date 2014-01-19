'use strict';
/**
 *  Mean container for dependency injection
 */
var dependable = require('dependable');
var mean = exports.mean = dependable.container();

mean.register('preRoute', function() {  
  return function (req,res,next) {
    //res.send(404,"404")
    next();
  };
});

mean.register('postRoute', function() {  
  return function (req,res,next) {    
    res.send(404,"asd")
  };
});

mean.resolve('preRoute');
mean.resolve('postRoute');

/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initializing system variables 
var config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');


// Bootstrap db connection
var db = mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

// Bootstrap passport config
require('./config/passport')(passport);

var app = express();

// Express settings
require('./config/express')(app, passport, db);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

// Initializing logger
logger.init(app, passport, mongoose);

// Register database for use by modules
mean.register('database', {
  connection : db
});

mean.register('app',function() {
  return app;
})

// Initialize the modules
require('./config/system/modules')(app); //might change name

// Expose app
exports = module.exports = app;


