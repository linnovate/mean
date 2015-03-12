'use strict';

var Q = require('q'),
  swig = require('swig'),
  fs = require('fs'),
  _ = require('lodash'),
  path = require('path'),
  util = require('./util'),
  DependableList = require('./dependablelist'),
  search = require('./search');

var _modules = new DependableList();

function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

//finding modules
//
function findModulesError (defer, error) {
  console.error('Error loading modules', error);
  defer.resolve();
}

function jQueryMinMapHandler(jqueryminmap,req,res){
  res.send(jqueryminmap);
}

function aggregatedJSSender(res,data){
  res.send(data);
}

function aggregatedJSHandler(meanioinstance, req, res) {
  res.setHeader('content-type', 'text/javascript');
  meanioinstance.aggregated('js', req.query.group ? req.query.group : 'footer', aggregatedJSSender.bind(null,res));
}

function aggregatedCSSSender(res,data){
  res.send(data);
};

function aggregatedCSSHandler(meanioinstance, req, res) {
  res.setHeader('content-type', 'text/css');
  meanioinstance.aggregated('css', req.query.group ? req.query.group : 'header', aggregatedCSSSender.bind(null,res));
};

function getModulesHandler(meanioinstance,req,res,next){
  res.json(meanioinstance.exportable_modules_list);
};

function findModulesDone (meanioinstance, app, defer) {
  var config = meanioinstance.config.clean;
  app.get('/_getModules',getModulesHandler.bind(null,meanioinstance));
  if(config.aggregation!==false){
    var jqueryminmap = fs.readFileSync(config.root + '/bower_components/jquery/dist/jquery.min.map');
    app.get('/modules/jquery.min.map',jQueryMinMapHandler.bind(null,jqueryminmap));
    app.get('/modules/aggregated.js', aggregatedJSHandler.bind(null,meanioinstance));
    app.get('/modules/aggregated.css', aggregatedCSSHandler.bind(null,meanioinstance));
    app.useStatic('/bower_components', config.root + '/bower_components');
  }
  if(!_modules.unresolved.empty()){
    throw 'Packages with unresolved dependencies: '+_modules.listOfUnresolved();
  }
  //Meanio.onModulesFoundAggregate('js',{}); //TODO: let each module aggregate its 'js'
  enableModules(meanioinstance,defer);
}
//


//enabling modules
//
function moduleActivator(defers,meaniosingleton,loadedmodule){
  if(loadedmodule){
    var defer = Q.defer();
    defers.push(defer);
    loadedmodule.activate();
    meaniosingleton.resolve(loadedmodule.name,defer.resolve.bind(defer));
  }
}

function moduleRegistrator(meaniosingleton,loadedmodule){
  if(loadedmodule){
    meaniosingleton.exportable_modules_list.push ({
      name:loadedmodule.name,
      angularDependencies: loadedmodule.angularDependencies
    });
  }
}

function onModulesEnabled(meanioinstance,defer){
  _modules.traverse(moduleRegistrator.bind(null,meanioinstance));
  defer.resolve();
}

function enableModules(meanioinstance,defer) {
  var defers = [];
  _modules.traverse(moduleActivator.bind(null,defers,meanioinstance));
  Q.all(defers).done(onModulesEnabled.bind(null,meanioinstance,defer));
}
//

function findModules(meanioinstance,defer,app) {
  var disabled = _.toArray(meanioinstance.config.clean.disabledModules);
  Q.all([
    search(_modules, disabled, 'node_modules'),
    search(_modules, disabled, 'packages'),
    search(_modules, disabled, 'packages/core'),
    search(_modules, disabled, 'packages/custom'),
    search(_modules, disabled, 'packages/contrib')
  ]).done(findModulesDone.bind(null, meanioinstance, app, defer), findModulesError.bind(null, defer));
}

function onInstance(meanioinstance,defer){
  meanioinstance.resolve('app',findModules.bind(null,meanioinstance,defer));
}

function moduleHasName(targetname,module){
  if(targetname===module.name){
    return true;
  }
}

function supportModules(Meanio){
  Meanio.onInstance(onInstance);
  Meanio.prototype.moduleEnabled = function(name) {
    return this.modules.traverseConditionally(moduleHasName.bind(null,name)) || false;
  };

  //static property
  Meanio.modules = _modules;

  //instance property
  Meanio.prototype.modules = Meanio.modules;

  Meanio.prototype.exportable_modules_list = [];

  function onModuleAngularDependenciesRegistered(callback){
    Meanio.createModels();
    callback();
  }

  function requireModel (path) {
    var mdl = require(path);
    if (mdl.register) {Meanio.applyModels(mdl.register);}
  }

  function Module(name) {
    this.loadedmodule = Meanio.modules.moduleNamed(name);
    if(!this.loadedmodule){
      Meanio.modules.dumpToConsole();
      throw 'Module with name '+name+' is not loaded';
    }
    this.name = lowerCaseFirstLetter(this.loadedmodule.name);
    this.menus = Meanio.Singleton.menus;
    this.config = Meanio.Singleton.config;

    // bootstrap models
    util.walk(this.loadedmodule.path('server'), 'model', null, requireModel);
  }

  Module.prototype.render = function(view, options, callback) {
    swig.renderFile(this.loadedmodule.path('server') + '/views/' + view + '.html', options, callback);
  };

  Module.prototype.setDefaultTemplate = function(template) {
    Meanio.Singleton.template = template;
  };

  Module.prototype.routes = function() {
    var args = Array.prototype.slice.call(arguments);
    util.walk(this.loadedmodule.path('server'), 'route', 'middlewares', this.onRoute.bind(this,[this].concat(args)));
  };

  Module.prototype.onRoute = function(args,route) {
    require(route).apply(this, args);
  }

  Module.prototype.register = function(callback) {
    Meanio.Singleton.register(this.name, callback);
  };

  Module.prototype.angularDependencies = function(dependencies) {
    this.angularDependencies = dependencies;
    this.loadedmodule.angularDependencies = dependencies;
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
  Module.bootstrapModules = function(callback){
    findModules(enableModules.bind(null,callback));
  };

  Meanio.prototype.Module = Module;
  require('./aggregation')(Meanio);

}

module.exports = supportModules;
