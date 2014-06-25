'use strict';

var swig = require('swig'),
    mongoose = require('mongoose'),
    container = require('dependable').container(),
    fs = require('fs'),
    path = require('path'),
    util = require('./util'),
    EventEmitter = require('events').EventEmitter;

var events = new EventEmitter(),
    Mean, modules = [],
    menus, config,
    allMenus = [],
    middleware = {
        before: {},
        after: {}
    },
    aggregated = {
        js: '',
        css: ''
    };

function Meanio() {
    if (this.active) return;
    Mean = this;
    this.events = events;
    this.version = require('../package').version;
}

Meanio.prototype.serve = function(options, callback) {

    if (this.active) return this;

    // Initializing system variables
    var defaultConfig = util.loadConfig();

    var database = mongoose.connect(defaultConfig.db || '', function(err) {
        if (err) {
            console.error('Error:', err.message);
            return console.error('**Could not connect to MongoDB. Please ensure mongod is running and restart MEAN app.**');
        }

        // Register database dependency
        Mean.register('database', {
            connection: database
        });

        Mean.config = new Config(function(err, config) {
            // Bootstrap Models, Dependencies, Routes and the app as an express app
            var app = require('./bootstrap')(options, database);

            // Start the app by listening on <port>, optional hostname
            app.listen(config.port, config.hostname);
            console.log('Mean app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');

            findModules(function() {
                enableModules();
            });
            aggregate('js', null);

            Mean.name = config.app.name;
            Mean.app = app;

            menus = new Mean.Menus();
            Mean.menus = menus;

            callback(app, config);
        });

        Mean.active = true;
        Mean.options = options;
    });
};

Meanio.prototype.loadConfig = util.loadConfig;

function Config(callback) {

    if (this.config) return this.config;

    loadSettings(this, callback);

    function update(settings, callback) {

        var Package = loadPackageModel();

        if (!Package) return callback(new Error('failed to load data model'));

        Package.findOneAndUpdate({
            name: 'config'
        }, {
            $set: {
                settings: settings,
                updated: new Date()
            }
        }, {
            upsert: true,
            multi: false
        }, function(err, doc) {
            if (err) {
                console.log(err);
                return callback(new Error('Failed to update settings'));
            }

            loadSettings(Mean.config);

            return callback(null, doc.settings);
        });
    }

    function loadSettings(Config, callback) {

        var Package = loadPackageModel();

        var defaultConfig = util.loadConfig();

        if (!Package) return defaultConfig;

        Package.findOne({
            name: 'config'
        }, function(err, doc) {

            var original = JSON.flatten(defaultConfig, {
                default: true
            });

            var saved = JSON.flatten(doc ? doc.settings : defaultConfig, {});

            var merged = mergeConfig(original, saved);

            var clean = JSON.unflatten(merged.clean, {});

            var diff = JSON.unflatten(merged.diff, {});

            Config.verbose = {
                clean: clean,
                diff: diff,
                flat: merged
            };

            Config.clean = clean;
            Config.diff = diff;
            Config.flat = merged;
            if (callback) callback(err, clean);
        });
    }

    function mergeConfig(original, saved) {

        var clean = {};

        for (var index in saved) {
            clean[index] = saved[index].value;
            if (original[index]) {
                original[index].value = saved[index].value;
            } else {
                original[index] = {
                    value: saved[index].value,
                };
            }

            original[index]['default'] = original[index]['default'] || saved[index]['default'];
        }

        return {
            diff: original,
            clean: clean
        };
    }

    function loadPackageModel() {

        var database = container.get('database');
        if (!database || !database.connection) {
            return null;
        }

        if (!database.connection.models.Package) {
            require('../modules/package')(database);
        }

        return database.connection.model('Package');
    }

    this.update = update;

}

Meanio.prototype.status = function() {
    return {
        active: this.active,
        name: this.name
    };
};

Meanio.prototype.register = container.register;

Meanio.prototype.resolve = container.resolve;

//confusing names, need to be refactored asap
Meanio.prototype.load = container.get;

Meanio.prototype.moduleEnabled = function(name) {
    return !!modules[name];
};

Meanio.prototype.modules = (function() {
    return modules;
})();

Meanio.prototype.aggregated = aggregated;

Meanio.prototype.Menus = function() {
    this.add = function(options) {
        if (!Array.isArray(options)) options = [options];

        options.forEach(function(opt) {
            opt.menu = opt.menu || 'main';
            opt.roles = opt.roles || ['anonymous'];
            allMenus[opt.menu] = allMenus[opt.menu] || [];
            allMenus[opt.menu].push(opt);
        });
        return menus;
    };

    this.get = function(options) {
        var allowed = [];
        options.menu = options.menu || 'main';
        options.roles = options.roles || ['anonymous'];

        if (!allMenus[options.menu] && !options.defaultMenu) return [];

        var items = options.defaultMenu.concat(allMenus[options.menu] || []);

        items.forEach(function(item) {

            var hasRole = false;
            options.roles.forEach(function(role) {
                if (role === 'admin' || item.roles.indexOf('anonymous') !== -1 || item.roles.indexOf(role) !== -1) {
                    hasRole = true;
                }
            });

            if (hasRole) {
                allowed.push(item);
            }
        });
        return allowed;
    };
};

Meanio.prototype.Module = function(name) {
    this.name = name;
    this.menus = menus;
    this.config = config;

    var nameCap = capitaliseFirstLetter(name);
    if (nameCap !== name) {
        modules[name] = modules[nameCap];
        delete modules[nameCap];
    }

    // bootstrap models
    util.walk(modulePath(this.name, 'server'), 'model', null, function(model) {
        require(model);
    });

    this.render = function(view, options, callback) {
        swig.renderFile(modulePath(this.name, '/server/views/' + view + '.html'), options, callback);
    };

    // bootstrap routes
    this.routes = function() {
        var args = Array.prototype.slice.call(arguments);
        var that = this;
        util.walk(modulePath(this.name, 'server'), 'route', 'middlewares', function(route) {
            require(route).apply(that, [that].concat(args));
        });
    };

    this.aggregateAsset = function(type, asset, options) {
        aggregate(type, (options && options.absolute ? asset : path.join(modules[this.name].source, this.name, 'public/assets', type, asset)), options);
    };

    this.register = function(callback) {
        container.register(name, callback);
    };

    this.angularDependencies = function(dependencies) {
        this.angularDependencies = dependencies;
        modules[this.name].angularDependencies = dependencies;
    };

    this.settings = function() {

        if (!arguments.length) return;

        var database = container.get('database');
        if (!database || !database.connection) {
            return {
                err: true,
                message: 'No database connection'
            };
        }

        if (!database.connection.models.Package) {
            require('../modules/package')(database);
        }

        var Package = database.connection.model('Package');
        if (arguments.length === 2) return updateSettings(this.name, arguments[0], arguments[1]);
        if (arguments.length === 1 && typeof arguments[0] === 'object') return updateSettings(this.name, arguments[0], function() {});
        if (arguments.length === 1 && typeof arguments[0] === 'function') return getSettings(this.name, arguments[0]);

        function updateSettings(name, settings, callback) {
            Package.findOneAndUpdate({
                name: name
            }, {
                $set: {
                    settings: settings,
                    updated: new Date()
                }
            }, {
                upsert: true,
                multi: false
            }, function(err, doc) {
                if (err) {
                    console.log(err);
                    return callback(new Error('Failed to update settings'));
                }
                return callback(null, doc);
            });
        }

        function getSettings(name, callback) {
            Package.findOne({
                name: name
            }, function(err, doc) {
                if (err) {
                    console.log(err);
                    return callback(new Error('Failed to retrieve settings'));
                }
                return callback(null, doc);
            });
        }
    };
};

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function modulePath(name, plus) {
    return path.join(process.cwd(), modules[name].source, name.toLowerCase(), plus);
}

function findModules(callback) {

    function searchSource(source, callback) {
        fs.readdir(path.join(process.cwd(), source), function(err, files) {
            if (err || !files || !files.length) {
                if (err && err.code !== 'ENOENT') console.log(err);
                return callback();
            }
            files.forEach(function(file, index) {
                fs.readFile(path.join(process.cwd(), source, file, 'package.json'), function(fileErr, data) {
                    if (err) throw fileErr;
                    if (data) {
                        try {
                            var json = JSON.parse(data.toString());
                            if (json.mean) {
                                modules[capitaliseFirstLetter(json.name)] = {
                                    version: json.version,
                                    source: source
                                };
                            }
                        } catch (err) {
                            return callback();
                        }
                    }
                    if (files.length - 1 === index) return callback();
                });
            });
        });
    }

    var sources = 2;

    function searchDone() {
        sources--;
        if (!sources) {
            events.emit('modulesFound');
            callback();
        }
    }
    searchSource('node_modules', searchDone);
    searchSource('packages', searchDone);
}

function enableModules(callback) {
    var name, remaining = 0;

    for (name in modules) {
        remaining++;
        require(modulePath(name, 'app.js'));
    }

    for (name in modules) {
        name = name;
        container.resolve.apply(container, [name]);
        container.get(name);
        remaining--;
        if (!remaining) {
            events.emit('modulesEnabled');
            if (callback) callback(modules);
        }
    }
}

//will do compression and mingify/uglify soon
function aggregate(ext, aggPath, options) {
    options = options || {};

    //Allow libs
    var libs = true;
    if (aggPath) return readFile(ext, path.join(process.cwd(), aggPath));

    //this redoes all the aggregation for the extention type
    aggregated[ext] = '';

    //Deny Libs
    libs = false;
    events.on('modulesFound', function() {
        for (var name in modules) {
            readFiles(ext, path.join(process.cwd(), modules[name].source, name.toLowerCase(), 'public'));
        }
    });

    function readFiles(ext, filepath) {
        fs.readdir(filepath, function(err, files) {
            if (err) return;
            files.forEach(function(file) {
                if (!libs && (file !== 'assets' && file !== 'tests')) {
                    readFile(ext, path.join(filepath, file));
                }
            });
        });
    }

    function readFile(ext, filepath) {
        fs.readdir(filepath, function(err, files) {
            if (files) return readFiles(ext, filepath);
            if (path.extname(filepath) !== '.' + ext) return;
            fs.readFile(filepath, function(fileErr, data) {
                //add some exists and refactor
                //if (fileErr) console.log(fileErr)

                if (!data) {
                    readFiles(ext, filepath);
                } else {
                    aggregated[ext] += (ext === 'js' && !options.global) ? ('(function(){' + data.toString() + '})();') : data.toString() + '\n';
                }
            });
        });
    }
}

Meanio.prototype.chainware = {

    add: function(event, weight, func) {
        middleware[event].splice(weight, 0, {
            weight: weight,
            func: func
        });
        middleware[event].join();
        middleware[event].sort(function(a, b) {
            if (a.weight < b.weight) {
                a.next = b.func;
            } else {
                b.next = a.func;
            }
            return (a.weight - b.weight);
        });
    },

    before: function(req, res, next) {
        if (!middleware.before.length) return next();
        this.chain('before', 0, req, res, next);
    },

    after: function(req, res, next) {
        if (!middleware.after.length) return next();
        this.chain('after', 0, req, res, next);
    },

    chain: function(operator, index, req, res, next) {
        var args = [req, res,
            function() {
                if (middleware[operator][index + 1]) {
                    this.chain('before', index + 1, req, res, next);
                } else {
                    next();
                }
            }
        ];

        middleware[operator][index].func.apply(this, args);
    }
};

module.exports = exports = new Meanio();
