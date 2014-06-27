'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    mean = require('meanio'),
    consolidate = require('consolidate'),
    mongoStore = require('mean-connect-mongo')(session),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    config = require('./config'),
    assetJSON = require('./assets.json'),
    expressValidator = require('express-validator'),
    appPath = process.cwd(),
    util = require('meanio/lib/util'),
    assetmanager = require('assetmanager'),
    fs = require('fs'),
    Grid = require('gridfs-stream');

module.exports = function(app, passport, db) {

    var gfs = new Grid(db.connection.db, db.mongo);

    app.set('showStackError', true);

    // Prettify HTML
    app.locals.pretty = true;

    // cache=memory or swig dies in NODE_ENV=production
    app.locals.cache = 'memory';

    // Should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
    app.use(compression({
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // assign the template engine to .html files
    app.engine('html', consolidate[config.templateEngine]);

    // set .html as the default extension
    app.set('view engine', 'html');

    // Set views path, template engine and default layout
    app.set('views', config.root + '/server/views');

    // Enable JSONP
    app.enable('jsonp callback');

    // The cookieParser should be above session
    app.use(cookieParser());

    // Request body parsing middleware should be above methodOverride
    app.use(expressValidator());
    app.use(bodyParser());
    app.use(methodOverride());

    // Import the assets file and add to locals
   var assets = assetmanager.process({
        assets: assetJSON,
        debug: process.env.NODE_ENV !== 'production',
        webroot: /public\/|packages\//g
    });
    app.use(function(req, res, next) {
        res.locals.assets = assets;
        next();
    });

    // Express/Mongo session storage
    app.use(session({
        secret: config.sessionSecret,
        store: new mongoStore({
            db: db.connection.db,
            collection: config.sessionCollection
        }),
        cookie: config.sessionCookie,
        name: config.sessionName
    }));

    // Dynamic helpers
    app.use(helpers(config.app.name));

    // Use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //mean middleware from modules before routes
    app.use(mean.chainware.before);

    // Connect flash for flash messages
    app.use(flash());

    // Setting the favicon and static folder
    app.use(favicon(appPath + '/public/system/assets/img/favicon.ico'));

    function themeHandler(req, res) {

        res.setHeader('content-type', 'text/css');

        gfs.files.findOne({
            filename: 'theme.css'
        }, function(err, file) {

            if (!file) {
                fs.createReadStream(appPath + '/public/system/lib/bootstrap/dist/css/bootstrap.css').pipe(res);
            } else {
                // streaming to gridfs
                var readstream = gfs.createReadStream({
                    filename: 'theme.css'
                });

                //error handling, e.g. file does not exist
                readstream.on('error', function(err) {
                    console.log('An error occurred!', err.message);
                    throw err;
                });

                readstream.pipe(res);
            }
        });
    }

    // We override this file to allow us to swap themes
    // We keep the same public path so we can make use of the bootstrap assets
    app.get('/system/lib/bootstrap/dist/css/bootstrap.css', themeHandler);

    app.use('/', express.static(config.root + '/public'));

    mean.events.on('modulesFound', function() {

        for (var name in mean.modules) {
            app.use('/' + name, express.static(config.root + '/' + mean.modules[name].source + '/' + name + '/public'));
        }

        function bootstrapRoutes() {
            // Skip the app/routes/middlewares directory as it is meant to be
            // used and shared by routes as further middlewares and is not a
            // route by itself
            util.walk(appPath + '/server', 'route', 'middlewares', function(path) {
                require(path)(app, passport);
            });
        }

        bootstrapRoutes();

        //mean middlware from modules after routes
        app.use(mean.chainware.after);

        // Assume "not found" in the error msgs is a 404. this is somewhat
        // silly, but valid, you can do whatever you like, set properties,
        // use instanceof etc.
        app.use(function(err, req, res, next) {
            // Treat as 404
            if (~err.message.indexOf('not found')) return next();

            // Log it
            console.error(err.stack);

            // Error page
            res.status(500).render('500', {
                error: err.stack
            });
        });

        // Assume 404 since no middleware responded
        app.use(function(req, res) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });

        // Error handler - has to be last
        if (process.env.NODE_ENV === 'development') {
            app.use(errorHandler());
        }
    });
};
