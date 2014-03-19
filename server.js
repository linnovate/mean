'use strict';
/**
 *  Mean container for dependency injection
 */
var dependable = require('dependable');
var mean = exports.mean = dependable.container();
var EventEmitter = require('events').EventEmitter;
mean.events = new EventEmitter();
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

// Register passport dependency
mean.register('passport', function() {
    return passport;
});

// Register auth dependency
mean.register('auth', function() {
    return require('./app/routes/middlewares/authorization');
});

// Register database dependency
mean.register('database', {
    connection: db
});

// Register app dependency
mean.register('app', function() {
    return app;
});

mean.register('events', function() {    
    return mean.events;
})

mean.register('middleware', function(app) {
    var middleware = {};

    middleware.add = function(event, weight, func) {
        mean.middleware[event].splice(weight, 0, {
            weight: weight,
            func: func
        });
        mean.middleware[event].join();
        mean.middleware[event].sort(function(a, b) {
            if (a.weight < b.weight) {
                a.next = b.func;
            } else {
                b.next = a.func;
            }
            return (a.weight - b.weight)
        });
    };

    middleware.before = function(req, res, next) {
        if (!mean.middleware.before.length) return next();
        chain('before', 0, req, res, next);
    };

    middleware.after = function(req, res, next) {
        if (!mean.middleware.after.length) return next();
        chain('after', 0, req, res, next);
    };

    function chain(operator, index, req, res, next) {
        var args = [req, res,
            function(err) {
                if (mean.middleware[operator][index + 1]) {
                    chain('before', index + 1, req, res, next);
                } else {
                    next();
                }
            }
        ];

        mean.middleware[operator][index].func.apply(this, args);
    }

    return middleware;
});


mean.register('modules', function(app, auth, database, events, middleware) {
    require('./config/system/modules')(mean, app, auth, database, events);
})

// Express settings
require('./config/express')(app, passport, db);

// Bootstrap routes
var routes_path = __dirname + '/app/routes';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(app, passport);
            }
            // We skip the app/routes/middlewares directory as it is meant to be
            // used and shared by routes as further middlewares and is not a 
            // route by itself
        } else if (stat.isDirectory() && file !== 'middlewares') {
            walk(newPath);
        }
    });
};
walk(routes_path);


mean.resolve({}, function(modules) {
    
})
// Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

// Initializing logger
logger.init(app, passport, mongoose);

// Expose app
exports = module.exports = app;