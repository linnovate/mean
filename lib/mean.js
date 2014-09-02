'use strict';

var swig = require('swig'),
  mongoose = require('mongoose'),
  container = require('dependable').container(),
  fs = require('fs'),
  _ = require('lodash'),
  path = require('path'),
  util = require('./util'),
  crypto = require('crypto'),
  uglify = require('uglify-js'),
  http = require('http'),
  https = require('https'),
  EventEmitter = require('events').EventEmitter,
  Q = require('q');

var events = new EventEmitter(),
  Mean, modules = [],
  menus, config,
  allMenus = [],
  middleware = {
    before: {},
    after: {}
  },

  aggregated = {
    header: {
      js: {
        data: null,
        weights: []
      },
      css: {
        data: null,
        weights: []
      }
    },
    footer: {
      js: {
        data: null,
        weights: []
      },
      css: {
        data: null,
        weights: []
      }
    }
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

  mongoose.set('debug', defaultConfig.mongoose && defaultConfig.mongoose.debug);

  var database = mongoose.connect(defaultConfig.db || '', defaultConfig.dbOptions || {}, function(err) {
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

      // Listen on http.port (or port as fallback for old configs)
      var httpServer = http.createServer(app);
      Mean.register('http', httpServer);
      httpServer.listen(config.http ? config.http.port : config.port, config.hostname);

      if (config.https && config.https.port) {
        var httpsOptions = {
          key: fs.readFileSync(config.https.ssl.key),
          cert: fs.readFileSync(config.https.ssl.cert)
        };

        var httpsServer = https.createServer(httpsOptions, app);
        Mean.register('https', httpsServer);
        httpsServer.listen(config.https.port);
      }

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
          value: saved[index].value
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

Meanio.prototype.aggregated = function(ext, group, callback) {
  // Aggregated Data already exists and is ready
  if (aggregated[group][ext].data) return callback(aggregated[group][ext].data);

  // No aggregated data exists so we will build it
  sortAggregateAssetsByWeight();

  // Returning rebuild data. All from memory so no callback required
  callback(aggregated[group][ext].data);
};

// Allows redbuilding aggregated data
Meanio.prototype.rebuildAggregated = function() {
  sortAggregateAssetsByWeight();
};

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
    options = options || {};
    options.menu = options.menu || 'main';
    options.roles = options.roles || ['anonymous'];
    options.defaultMenu = options.defaultMenu || [];

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
  this.name = lowerCaseFirstLetter(name);
  this.menus = menus;
  this.config = config;

  // bootstrap models
  util.walk(modulePath(this.name, 'server'), 'model', null, require);

  this.render = function(view, options, callback) {
    swig.renderFile(modulePath(this.name, '/server/views/' + view + '.html'), options, callback);
  };

  this.setDefaultTemplate = function(template) {
    Mean.template = template;
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
    options = options || {};
    asset = options.inline ? asset : (options.absolute ? asset : path.join(modules[this.name].source, this.name, 'public/assets', type, asset));
    aggregate(type, asset, options);
  };

  this.register = function(callback) {
    container.register(lowerCaseFirstLetter(name), callback);
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

function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function modulePath(name, plus) {
  return path.join(process.cwd(), modules[name].source, name, plus);
}

function findModules(callback) {

  function searchSource(source) {
    var deferred = Q.defer();
    fs.readdir(path.join(process.cwd(), source), function(err, files) {
      if (err || !files || !files.length) {

        if (err && err.code !== 'ENOENT') {
          console.log(err);
        } else {
          return deferred.resolve();
        }
        return deferred.reject(err);
      }

      var promises = [];
      files.forEach(function(file) {
        var fileDefer = Q.defer();
        fs.readFile(path.join(process.cwd(), source, file, 'package.json'), function(fileErr, data) {
          if (data) {
            try {
              var json = JSON.parse(data.toString());
              if (json.mean) {
                modules[file] = {
                  version: json.version,
                  source: source
                };
              }
            } catch (err) {
              fileDefer.reject(err);
            }
          }
          fileDefer.resolve();
        });
        promises.push(fileDefer.promise);
      });
      return deferred.resolve(Q.all(promises));
    });
    return deferred.promise;
  }
  Q.all([searchSource('node_modules'), searchSource('packages'),searchSource('packages/core'),searchSource('packages/custom'),searchSource('packages/contrib')]).done(function() {
    events.emit('modulesFound');
    callback();
  }, function(error) {
    console.error('Error loading modules. ' + error);
    callback();
  });
}

function sortAggregateAssetsByWeight() {
  for (var region in aggregated) {
    for (var ext in aggregated[region]) {
      sortByWeight(region, ext);
    }
  }
}

function sortByWeight(group, ext) {
  var weights = aggregated[group][ext].weights;
  var temp = [];

  for (var file in weights) {
    temp.push({
      data: weights[file].data,
      weight: weights[file].weight
    });
  }
  aggregated[group][ext].data = _.map(_.sortBy(temp, 'weight'), function(value) {
    return value.data;
  }).join('\n');
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

function aggregate(ext, asset, options) {
  options = options || {};

  var ugly = null,
    group = options.group,
    weight = options.weight || 0;

  //Allow libs
  var libs = true;
  if (asset) {
    return options.inline ? addInlineCode(ext, asset) : readFile(ext, path.join(process.cwd(), asset));
  }

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

  function pushAggregatedData(ext, filename, data) {
    if (ext === 'js') {

      group = options.group || 'footer';

      var code = options.global ? data.toString() + '\n' : '(function(){' + data.toString() + '})();';

      ugly = uglify.minify(code, {
        fromString: true,
        mangle: false
      });

      aggregated[group][ext].weights[filename] = {
        weight: weight,
        data: !Mean.config.clean.debug ? ugly.code : code
      };
    } else {
      group = options.group || 'header';

      aggregated[group][ext].weights[filename] = {
        weight: weight,
        data: data.toString()
      };
    }
  }

  function addInlineCode(ext, data) {
    var md5 = crypto.createHash('md5');
    md5.update(data);
    var hash = md5.digest('hex');
    pushAggregatedData(ext, hash, data);
  }


  function readFile(ext, filepath) {
    fs.readdir(filepath, function(err, files) {
      if (files) return readFiles(ext, filepath);
      if (path.extname(filepath) !== '.' + ext) return;
      fs.readFile(filepath, function(fileErr, data) {
        if (!data) {
          readFiles(ext, filepath);
        } else {
          var filename = filepath.split(process.cwd())[1];
          pushAggregatedData(ext, filename, data);
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
