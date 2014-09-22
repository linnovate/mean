'use strict';

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

function createConfig(Meanio){
  function Config(defaultconfig) {
    this.verbose = {};
    this.original = JSON.flatten(defaultconfig, {
      default: true
    });
    this.clean = null;
    this.diff = null;
    this.flat = null;
    this.createConfigurations(defaultconfig);
  }

  Config.prototype.loadSettings = function(callback) {
    var Package = this.loadPackageModel();
    if (!Package){
      return callback ? callback(this.original) : undefined;
    }
    Package.findOne({
      name: 'config'
    }, this.onPackageRead.bind(this,callback));
  };

  Config.prototype.updateSettings = function(name, settings, callback) {
    var Package = this.loadPackageModel();
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

  Config.prototype.loadPackageModel = function() {
    var database = Meanio.Singleton.get('database');
    if (!database || !database.connection) {
      return null;
    }
    if (!database.connection.models.Package) {
      require('../modules/package')(database);
    }
    return database.connection.model('Package');
  };

  Config.prototype.onPackageRead = function(callback,err,doc){
    if (err) {
      return callback ? callback(err) : undefined;
    }

    if(!(doc&&doc.settings)){
      return callback ? callback() : undefined;
    }
    this.createConfigurations(doc.settings);
    if (callback) callback();
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
    }, this.onPackageRead.bind(this,callback));
  };

  Meanio.Config = Config;
}

module.exports = createConfig;
