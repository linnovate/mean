var fs = require('fs'),
    express = require('express'),
    appPath = process.cwd();

module.exports = function(mean, passport, db) {
    bootstrapModels();

    // Bootstrap passport config
    require(appPath + '/config/passport')(passport);
    bootstrapDependencies();

    // Express settings
    var app = express();
    require(appPath + '/config/express')(mean, app, passport, db);

    bootstrapRoutes();

    function bootstrapModels() {
        var models_path = appPath + '/app/models';
        var walk = function (path) {
            fs.readdirSync(path).forEach(function (file) {
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

        mean.register('events', function() {
            return mean.events;
        });

        mean.register('middleware', function() {
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
                    return (a.weight - b.weight);
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
                    function() {
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
            require(appPath + '/config/system/modules')(mean, app, auth, database, events, middleware);
        });
    }

    function bootstrapRoutes() {
        var routes_path =  appPath + '/app/routes';
        var walk = function(path) {
            console.log(path);
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