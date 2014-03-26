var fs = require('fs'),
    express = require('express'),
    appPath = process.cwd();

var mean = require('meanio');

module.exports = function(passport, db) {
    bootstrapModels();

    // Bootstrap passport config
    require(appPath + '/config/passport')(passport);
    bootstrapDependencies();

    // Express settings
    var app = express();
    require(appPath + '/config/express')(app, passport, db);

    bootstrapRoutes();

    function bootstrapModels() {
        var models_path = appPath + '/app/models';
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
    }

    function bootstrapDependencies() {
        // Register passport dependency
        mean.register('passport', function() {
            return passport;
        });

        // Register auth dependency
        mean.register('auth', function() {
            return require(appPath + '/app/routes/middlewares/authorization');
        });

        // Register database dependency
        mean.register('database', {
            connection: db
        });

        // Register app dependency
        mean.register('app', function() {
            return app;
        });     
    }

    function bootstrapRoutes() {
        var routes_path = appPath + '/app/routes';
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

    return app;
};