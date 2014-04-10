'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    mean = require('meanio'),
    consolidate = require('consolidate'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    config = require('./config'),
    expressValidator = require('express-validator'),
    appPath = process.cwd(),
    fs = require('fs'),
    assetmanager = require('assetmanager');

module.exports = function(app, passport, db) {
    app.set('showStackError', true);

    // Prettify HTML
    app.locals.pretty = true;

    // cache=memory or swig dies in NODE_ENV=production
    app.locals.cache = 'memory';

    // Should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development') {
        app.use(express.logger('dev'));
    }

    // assign the template engine to .html files
    app.engine('html', consolidate[config.templateEngine]);

    // set .html as the default extension
    app.set('view engine', 'html');

    // Set views path, template engine and default layout
    app.set('views', config.root + '/server/views');

    // Enable jsonp
    app.enable('jsonp callback');

    app.configure(function() {
        // The cookieParser should be above session
        app.use(express.cookieParser());

        // Request body parsing middleware should be above methodOverride
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(expressValidator());
        app.use(express.methodOverride());

        // Import your asset file
        var assets = require('./assets.json');
        assetmanager.init({
            js: assets.js,
            css: assets.css,
            debug: (process.env.NODE_ENV !== 'production'),
            webroot: 'public/public'
        });
        // Add assets to local variables
        app.use(function(req, res, next) {
            res.locals({
                assets: assetmanager.assets
            });
            next();
        });

        // Express/Mongo session storage
        app.use(express.session({
            secret: config.sessionSecret,
            store: new mongoStore({
                db: db.connection.db,
                collection: config.sessionCollection
            })
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

        // Routes should be at the last
        app.use(app.router);

        // Setting the fav icon and static folder
        app.use(express.favicon());
        app.use('/public', express.static(config.root + '/public'));

        app.get('/modules/aggregated.js', function(req, res) {
            res.setHeader('content-type', 'text/javascript');
            res.send(mean.aggregated.js);
        });


        app.get('/modules/aggregated.css', function(req, res) {
            res.setHeader('content-type', 'text/css');
            res.send(mean.aggregated.css);
        });

        mean.events.on('modulesFound', function() {

            for (var name in mean.modules) {
                app.use('/' + name, express.static(config.root + '/'+mean.modules[name].source+'/' + name + '/public'));
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

        });


    });

    function bootstrapRoutes() {
        var routes_path = appPath + '/server/routes';
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
    }
};