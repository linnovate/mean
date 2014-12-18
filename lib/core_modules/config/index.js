'use strict';

var Q = require('q'),
    fs = require('fs'),
    _ = require('lodash');

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

function loadConfig() {
  // Load configurations
  // Set the node environment variable if not set before
  var configPath = process.cwd() + '/config/env';
  process.env.NODE_ENV = ~fs.readdirSync(configPath).map(function(file) {
    return file.slice(0, -3);
  }).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

  // Extend the base configuration in all.js with environment
  // specific configuration
  return _.extend(
    require(configPath + '/all'),
    require(configPath + '/' + process.env.NODE_ENV) || {}
  );
}

function Config(defaultconfig) {
  defaultconfig = defaultconfig || loadConfig();
  this.verbose = {};
  this.original = JSON.flatten(defaultconfig, {
    default: true
  });
  this.clean = null;
  this.diff = null;
  this.flat = null;
  this.createConfigurations(defaultconfig);
}

Config.prototype.loadSettings = function(defer) {
  var Package = this.loadPackageModel(this.onPackageForSettingsLoaded.bind(this,defer));
};

Config.prototype.onPackageForSettingsLoaded = function(defer,Package){
  if (!Package){
    defer.resolve(this.original);
  }
  Package.findOne({
    name: 'config'
  }, this.onPackageRead.bind(this,defer));
};

Config.prototype.updateSettings = function(name, settings, callback) {
  var Package = this.loadPackageModel(this.onPackageForUpdateLoaded.bind(this,callback,settings));
};

Config.prototype.onPackageForUpdateLoaded = function(callback,settings,Package){
  if (!Package){
    return callback ? callback(new Error('Failed to update settings')) : undefined;
  }
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
};

Config.prototype.getSettings = function(name, callback) {
  var Package = this.loadPackageModel();
  if (!Package){
    return callback ? callback(new Error('Failed to retrieve settings')) : undefined;
  }
  Package.findOne({
    name: name
  }, function(err, doc) {
    if (err) {
      console.log(err);
      return callback(new Error('Failed to retrieve settings'));
    }
    return callback(null, doc);
  });
};

Config.prototype.loadPackageModel = function(callback) {
  var database = Config.Meanio.resolve('database',this.onDatabaseLoadPackageModel.bind(this,callback));
};

Config.prototype.onDatabaseLoadPackageModel = function(callback,database){
  if (!database || !database.connection) {
    callback(null);
    return;
  }
  if (!database.connection.models.Package) {
    require('./package')(database);
  }
  callback(database.connection.model('Package'));
};

Config.prototype.onPackageRead = function(defer,err,doc){
  if (err) {
    defer.resolve(err); //problematic, but the whole code needs to be changed to support err exception
    return;
  }

  if(!(doc&&doc.settings)){
    defer.resolve();
    return;
  }
  this.createConfigurations(doc.settings);
  defer.resolve();
};

Config.prototype.createConfigurations = function(config){
  var saved = JSON.flatten(config, {});
  var merged = mergeConfig(this.original, saved);
  var clean = JSON.unflatten(merged.clean, {});
  var diff = JSON.unflatten(merged.diff, {});
  this.verbose = {
    clean: clean,
    diff: diff,
    flat: merged
  };
  this.clean = clean;
  this.diff = diff;
  this.flat = merged;
};

Config.prototype.update = function(settings, callback) {
  var Package = this.loadPackageModel();
  if (!Package) return callback(new Error('failed to load data model'));
  var defer = Q.defer();
  Package.findOneAndUpdate({
    name: 'config'
  }, {
    $set: {
      settings: settings,
      updated: new Date()
    }
  }, {
    upsert: true,
    new: true,
    multi: false
  }, this.onPackageRead.bind(this,defer));
  defer.promise.then(callback);
};

function onInstance(Meanio,meanioinstance,defer){
  Config.Meanio = meanioinstance;
  meanioinstance.config = new Config();
  meanioinstance.register('defaultconfig',meanioinstance.config);
  meanioinstance.resolve('database',meanioinstance.config.loadSettings.bind(meanioinstance.config,defer));
}

function createConfig(Meanio){

  Meanio.onInstance(onInstance.bind(null,Meanio));
  Meanio.Config = Config;
}

module.exports = createConfig;
