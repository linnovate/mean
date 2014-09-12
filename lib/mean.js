'use strict';

var swig = require('swig'),
  mongoose = require('mongoose'),
  container = require('dependable').container(),
  fs = require('fs'),
  path = require('path'),
  util = require('./util'),
  http = require('http'),
  https = require('https'),
  _ = require('lodash'),
  EventEmitter = require('events').EventEmitter,
  Q = require('q');

var events = new EventEmitter(),
  allMenus = [],
  middleware = {
    before: {},
    after: {}
  };

function Meanio() {
  if (this.active) return;
  Meanio.Singleton = this;
  this.version = require('../package').version;
  this.events = events;
}
Meanio.events = events;

function connectDbOk (defer, s) {
  defer.resolve(s);
}
function connectDbFailed(defer, s) {
  defer.reject(s);
}

function connectDb (alias, path) {
  var defer = Q.defer();
  var connection = mongoose.createConnection (path);

  connection.once ('connected', connectDbOk.bind(null, defer, {path:path, alias: alias, connection: connection}));
  connection.once('error', connectDbFailed.bind(null, defer, {}));
  return defer.promise;
}

function doBootstrap (options, callback, database, err, config) {
  // Bootstrap Models, Dependencies, Routes and the app as an express app
  var app = require('./bootstrap')(options, database);

  // Listen on http.port (or port as fallback for old configs)
  var httpServer = http.createServer(app);
  Meanio.Singleton.register('http', httpServer);
  httpServer.listen(config.http ? config.http.port : config.port, config.hostname);

  if (config.https && config.https.port) {
    var httpsOptions = {
      key: fs.readFileSync(config.https.ssl.key),
      cert: fs.readFileSync(config.https.ssl.cert)
    };

    var httpsServer = https.createServer(httpsOptions, app);
    Meanio.Singleton.register('https', httpsServer);
    httpsServer.listen(config.https.port);
  }
  var disabled = {};
  for (var i in config.disabled_modules) {
    disabled[config.disabled_modules[i]] = true;
  }

  findModules(enableModules, disabled);

  Meanio.Singleton.aggregate('js', null);

  Meanio.Singleton.name = config.app.name;
  Meanio.Singleton.app = app;
  Meanio.Singleton.menus = new Meanio.Singleton.Menus();

  callback(app, config);
}

function dataBasesReady (options, callback, database, connection_pool) {
  var alias_map = {};
  for (var i in connection_pool) {
    if (connection_pool[i].state !== 'fulfilled') continue;
    alias_map[connection_pool[i].value.alias] = connection_pool[i].value.connection;
  }

  mongoose.get_MEANIODB_connection = function (alias) {
    if ('default' === alias || !alias_map[alias]) {
      return database;
    }
    return alias_map[alias];
  }
  mongoose.alias_MEANIODB_exists = function (alias) {
    return (alias === 'default') || !alias || alias in alias_map;
  }

  Meanio.Singleton.config = new Config(doBootstrap.bind(null, options, callback, database));
  Meanio.Singleton.active = true;
  Meanio.Singleton.options = options;
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
    Meanio.Singleton.register('database', {
      connection: database
    });

    var db_promisses = [];
    for (var i in defaultConfig.dbs) {
      db_promisses.push (connectDb(i, defaultConfig.dbs[i]));
    }
    Q.allSettled (db_promisses).then(dataBasesReady.bind(this, options, callback, database));
  });
};

Meanio.prototype.loadConfig = util.loadConfig;

function Config(callback) {

  if (this.config) return this.config;

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

      loadSettings(Meanio.Singleton.config);

      return callback(null, doc.settings);
    });
  }

  function loadSettings(Config, callback) {

    var Package = loadPackageModel();

    var defaultConfig = util.loadConfig();
    console.log('o cemu se ovde radi?', Package, defaultConfig);

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


  loadSettings(this, callback);
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
  return !!this.modules[name];
};

//static property
Meanio.modules = [];

//instance property
Meanio.prototype.modules = Meanio.modules;

Meanio.prototype.Menus = function() {
  this.add = function(options) {
    if (!Array.isArray(options)) options = [options];

    options.forEach(function(opt) {
      opt.menu = opt.menu || 'main';
      opt.roles = opt.roles || ['anonymous'];
      allMenus[opt.menu] = allMenus[opt.menu] || [];
      allMenus[opt.menu].push(opt);
    });
    return Meanio.Singleton.menus;
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

function filterDBAliases (v) {
  return mongoose.alias_MEANIODB_exists(v);
}

function applyModels (schema, model, collection, dbalias) {
  mongoose.get_MEANIODB_connection(dbalias).model(model, schema, collection);
}

function requireModel (path) {
  var mdl = require(path);
  if (!mdl.register) return;
  for (var i in mdl.register) {
    var itm = mdl.register[i];
    if (!itm.schema) {
      throw "No schema in reqister model request, can not move on ...";
    }
    if (!itm.model) {
      throw "No model in register model request, can not move on ...";
    }
    if (!itm.dbs || itm.dbs.length === 0) {
      itm.dbs = ['default'];
    }
    _.uniq(itm.dbs.filter(filterDBAliases)).forEach (applyModels.bind(null, itm.schema, itm.model, itm.collection));
  }
}

function Module(name) {
  this.name = lowerCaseFirstLetter(name);
  this.menus = Meanio.Singleton.menus;
  this.config = Meanio.Singleton.config;

  // bootstrap models
  util.walk(modulePath(this.name, 'server'), 'model', null, requireModel);

}

Module.prototype.render = function(view, options, callback) {
  swig.renderFile(modulePath(this.name, '/server/views/' + view + '.html'), options, callback);
};

Module.prototype.setDefaultTemplate = function(template) {
  Meanio.Singleton.template = template;
};

Module.prototype.routes = function() {
  var args = Array.prototype.slice.call(arguments);
  var that = this;
  util.walk(modulePath(this.name, 'server'), 'route', 'middlewares', function(route) {
    require(route).apply(that, [that].concat(args));
  });
};

Module.prototype.register = function(callback) {
  container.register(this.name, callback);
};

Module.prototype.angularDependencies = function(dependencies) {
  this.angularDependencies = dependencies;
  Meanio.modules[this.name].angularDependencies = dependencies;
};


function updateSettings(Package, name, settings, callback) {
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

function getSettings(Package, name, callback) {
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

Module.prototype.settings = function() {

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
  if (arguments.length === 2) return updateSettings(Package, this.name, arguments[0], arguments[1]);
  if (arguments.length === 1 && typeof arguments[0] === 'object') return updateSettings(Package, this.name, arguments[0], function() {});
  if (arguments.length === 1 && typeof arguments[0] === 'function') return getSettings(Package, this.name, arguments[0]);

};

Meanio.prototype.Module = Module;

function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function modulePath(name, plus) {
  return path.join(process.cwd(), Meanio.modules[name].source, name, plus);
}

function readModuleFileDone (fileDefer, file, source, fileErr, data) {
  if (data) {
    try {
      var json = JSON.parse(data.toString());
      if (json.mean) {
        Meanio.modules[file] = {
          version: json.version,
          source: source
        };
      }
    } catch (err) {
      fileDefer.reject(err);
    }
  }
  fileDefer.resolve();
}

function fileForEachProcess (source, promises, file) {
  var fileDefer = Q.defer();
  fs.readFile(path.join(process.cwd(), source, file, 'package.json'), readModuleFileDone.bind(null, fileDefer, file, source));
  promises.push(fileDefer.promise);
}

function processDirFilesFromSearchSource(disabled, source, deferred, err, files) {
  if (err || !files || !files.length) {
    if (err && err.code !== 'ENOENT') {
      console.log(err);
    } else {
      return deferred.resolve();
    }
    return deferred.reject(err);
  }

  var promises = [];
  for (var i in disabled) {
    var index = files.indexOf(disabled[i]);
    if (index < 0) continue;
    files.splice(index, 1);
  }

  files.forEach(fileForEachProcess.bind(null, source, promises));
  return deferred.resolve(Q.all(promises));
}

function searchSourceForFindModules(disabled, source) {
  var deferred = Q.defer();
  fs.readdir(path.join(process.cwd(), source), processDirFilesFromSearchSource.bind (null, disabled, source, deferred));
  return deferred.promise;
}

function findModulesDone (callback) {
  events.emit('modulesFound');
  callback();
}

function findModulesError (callback, error) {
  console.error('Error loading modules. ' + error);
  callback();
}

function findModules(callback, disabled) {
  Q.all([searchSourceForFindModules(disabled, 'node_modules'), searchSourceForFindModules(disabled, 'packages'),searchSourceForFindModules(disabled, 'packages/core'),searchSourceForFindModules(disabled, 'packages/custom'),searchSourceForFindModules(disabled, 'packages/contrib')])
  .done(findModulesDone.bind(null, callback), findModulesError.bind(null, callback));
}


function enableModules() {
  var name, remaining = 0;
  for (name in Meanio.modules) {
    remaining++;
    require(modulePath(name, 'app.js'));
  }

  for (name in Meanio.modules) {
    name = name;
    container.resolve.apply(container, [name]);
    container.get(name);
    remaining--;
    if (!remaining) {
      events.emit('modulesEnabled');
    }
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

(require('./aggregation'))(Meanio);

module.exports = exports = new Meanio();
