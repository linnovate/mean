'use strict';

var Q = require('q'),
  swig = require('swig'),
  fs = require('fs'),
  _ = require('lodash'),
  path = require('path'),
  util = require('./util');

function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}


function supportModules(Meanio){

  function findModulesDone (callback) {
    Meanio.onModulesFoundAggregate('js',{});
    callback();
  }

  function findModulesError (callback, error) {
    console.error('Error loading modules. ' + error);
    callback();
  }


  function searchSourceForFindModules(disabled, source) {
    var deferred = Q.defer();
    fs.readdir(path.join(process.cwd(), source), processDirFilesFromSearchSource.bind (null, disabled, source, deferred));
    return deferred.promise;
  }

  function findModules(callback) {
    var disabled = _.toArray(Meanio.Singleton.config.clean);
    Q.all([searchSourceForFindModules(disabled, 'node_modules'), searchSourceForFindModules(disabled, 'packages'),searchSourceForFindModules(disabled, 'packages/core'),searchSourceForFindModules(disabled, 'packages/custom'),searchSourceForFindModules(disabled, 'packages/contrib')])
    .done(findModulesDone.bind(null, callback), findModulesError.bind(null, callback));
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
      var index = files.indexOf(i);
      if (index < 0) continue;
      files.splice(index, 1);
    }

    files.forEach(fileForEachProcess.bind(null, source, promises));
    return deferred.resolve(Q.all(promises));
  }

  function enableModules() {
    var name, remaining = 0;
    for (name in Meanio.modules) {
      remaining++;
      require(modulePath(name, 'app.js'));
    }

    for (name in Meanio.modules) {
      name = name;
      Meanio.Singleton.resolve(name);
      Meanio.Singleton.get(name);
      remaining--;
      if (!remaining) {
        Meanio.createModels();
        Meanio.Singleton.events.emit('modulesEnabled');
      }
    }
  }



  function requireModel (path) {
    var mdl = require(path);
    if (mdl.register) {Meanio.applyModels(mdl.register);}
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
    Meanio.Singleton.register(this.name, callback);
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
        return callback(true, 'Failed to update settings');
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
        return callback(true, 'Failed to retrieve settings');
      }
      return callback(null, doc);
    });
  }


  Module.prototype.settings = function() {

    if (!arguments.length) return;

    var database = Meanio.Singleton.get('database');
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
  Module.bootstrapModules = function(){
    findModules(enableModules);
  };

  Meanio.prototype.Module = Module;

  function modulePath(name, plus) {
    return path.join(process.cwd(), Meanio.modules[name].source, name, plus);
  }

}

module.exports = supportModules;
