'use strict';

var mongoose = require ('mongoose'),
  Q = require('q'),
  Schema = mongoose.Schema,
  _ = require('lodash');

function filterDBAliases (v) {
  return mongoose.alias_MEANIODB_exists(v);
}

function applyModels (schema, model, collection, dbalias) {
  mongoose.get_MEANIODB_connection(dbalias).model(model, schema, collection);
  return mongoose.get_MEANIODB_connection(dbalias).model(model);
}

function connectDb (alias, path) {
  var defer = Q.defer();
  var connection = mongoose.createConnection (path);
  connection.once ('connected', connectDbOk.bind(null, defer, {path:path, alias: alias, connection: connection}));
  connection.once('error', connectDbFailed.bind(null, defer, {}));
  return defer.promise;
}

function connectDbOk (defer, s) {
  defer.resolve(s);
}

function connectDbFailed(defer, s) {
  defer.reject(s);
}

function dataBasesReady (done, database, connection_pool) {
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
  };

  mongoose.alias_MEANIODB_exists = function (alias) {
    return (alias === 'default') || !alias || alias in alias_map;
  };

  done.resolve();
}

var lazyModelsMap = {};

function createModelStructure (schema, model, collection, db) {
  db = db || 'default';
  if (!lazyModelsMap[db]) lazyModelsMap[db] = {};
  if (!lazyModelsMap[db][model]) lazyModelsMap[db][model] = {pre:[], post:[], virtual: [], indices: []};

  var mc = lazyModelsMap[db][model];
  mc.collection = collection;
  mc.fields = _.merge (mc.fields || {}, schema.fields);
  mc.methods = _.assign (mc.methods || {}, schema.methods);
  mc.statics = _.assign (mc.statics || {}, schema.statics);

  if (schema.options) mc.options = _.assign (mc.options || {}, schema.options);
  if (schema.indices) Array.prototype.push (mc.indices, schema.indices);
  if (schema.pre) mc.pre.push (schema.pre);
  if (schema.virtual) mc.virtual.push (schema.virtual);
}

function bindIndices (s, i) {
  s.index(i);
}
function bindVirtuals (s, vr) {
  for (var name in vr) {
    var v = s.virtual(name);
    console.log('create virtual ', name);
    if (vr[name].get) v.get(vr[name].get);
    if (vr[name].set) v.set(vr[name].set);
  }
}

function bindHook (s, type, rec) {
  for (var name in rec) {
    console.log('create hook', name);
    s[type](name, rec[name]);
  }
}

function onInstanceAndConfig(defer, meanioinstance, config, done) {
  var defaultConfig = config.clean;
  mongoose.set('debug', defaultConfig.mongoose && defaultConfig.mongoose.debug);
  var database = mongoose.connect(defaultConfig.db || '', defaultConfig.dbOptions || {}, function(err) {
    if (err) {
      console.error('Error:', err.message);
      return console.error('**Could not connect to MongoDB. Please ensure mongod is running and restart MEAN app.**');
    }

    // Register database dependency
    meanioinstance.register('database', {
      connection:database
    });

    var db_promises = [];
    for (var i in defaultConfig.dbs) {
      db_promises.push (connectDb(i, defaultConfig.dbs[i]));
    }
    Q.allSettled (db_promises).then(dataBasesReady.bind(null, defer, database));
  });
};

function onInstance(meanioinstance,defer){
  meanioinstance.resolve('defaultconfig',onInstanceAndConfig.bind(null,defer,meanioinstance));
}

function supportDB(Meanio) {
  Meanio.onInstance(onInstance);

  Meanio.createModels = function () {
    for (var db in lazyModelsMap) {
      for (var model in lazyModelsMap[db]) {
        var rec = lazyModelsMap[db][model];
        //console.log('for db', db,' model ',model, 'is about to be created:',rec);
        var s = new Schema(rec.fields, rec.options);
        s.methods = rec.methods;
        s.statics = rec.statics;
        rec.virtual.forEach(bindVirtuals.bind(null, s));
        rec.pre.forEach(bindHook.bind(null, s, 'pre'));
        rec.post.forEach(bindHook.bind(null, s, 'post'));
        rec.indices.forEach(bindIndices.bind(null, s));
        var m = applyModels(s, model, rec.collection, db);
        Meanio.Singleton.events.emit ('lazy_model_ready', {model: m, db: db});
      }
    }
    Meanio.Singleton.events.emit('lazy_models_ready');
  };

  Meanio.applyModels = function (model_register) {
    for (var i in model_register) {
      var itm = model_register[i];
      if (!itm.schema) {
        throw 'No schema in reqister model request, can not move on ...';
      }
      if (!itm.model) {
        throw 'No model in register model request, can not move on ...';
      }
      if (!itm.dbs || itm.dbs.length === 0) {
        itm.dbs = ['default'];
      }
      if (itm.schema instanceof mongoose.Schema) {
        ///filter out eventual duplicates in dbs array and nonexisting aliases as well
        _.uniq(itm.dbs.filter(filterDBAliases)).forEach(applyModels.bind(null, itm.schema, itm.model, itm.collection));
        continue;
      }

      //ok, now form structures for lazy model creation
      itm.dbs.forEach( createModelStructure.bind(null, itm.schema, itm.model, itm.collection) );
    }
  };
}
module.exports = supportDB;
