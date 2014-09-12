var mongoose = require ('mongoose'),
  Q = require('q'),
  _ = require('lodash');

function filterDBAliases (v) {
  return mongoose.alias_MEANIODB_exists(v);
}

function applyModels (schema, model, collection, dbalias) {
  mongoose.get_MEANIODB_connection(dbalias).model(model, schema, collection);
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

function dataBasesReady (done, connection_pool) {
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
  done();
}

function supportDB(Meanio) {
  Meanio.connectDBs = function (defaultConfig, done) {
    mongoose.set('debug', defaultConfig.mongoose && defaultConfig.mongoose.debug);
    var database = mongoose.connect(defaultConfig.db || '', defaultConfig.dbOptions || {}, function(err) {
      if (err) {
        console.error('Error:', err.message);
        return console.error('**Could not connect to MongoDB. Please ensure mongod is running and restart MEAN app.**');
      }

      // Register database dependency
      Meanio.Singleton.register('database', {
        connection:database
      });

      var db_promises = [];
      for (var i in defaultConfig.dbs) {
        db_promises.push (connectDb(i, defaultConfig.dbs[i]));
      }
      Q.allSettled (db_promises).then(dataBasesReady.bind(this, done));
    });
  };

  Meanio.applyModels = function (model_register) {
    for (var i in model_register) {
      var itm = model_register[i];
      if (!itm.schema) {
        throw "No schema in reqister model request, can not move on ...";
      }
      if (!itm.model) {
        throw "No model in register model request, can not move on ...";
      }
      if (!itm.dbs || itm.dbs.length === 0) {
        itm.dbs = ['default'];
      }
      _.uniq(itm.dbs.filter(filterDBAliases)).forEach(applyModels.bind(null, itm.schema, itm.model, itm.collection));
    }
  };
}
module.exports = supportDB;
