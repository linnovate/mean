'use strict';

var container = require('dependable').container(),
  util = require('./util'),
  EventEmitter = require('events').EventEmitter;

var events = new EventEmitter(),
  middleware = {
    before: {},
    after: {}
  };

function doBootstrap (callback, err) {
  if (err) {
    console.log('Bootstrap cowardly retreating due to error:' ,err);
    return callback ? callback() : undefined;
  }
  Meanio.Singleton.config.loadSettings(function(){
    // Bootstrap Models, Dependencies, Routes and the app as an express app
    require('./bootstrap')(Meanio);
    callback(Meanio.Singleton.app, Meanio.Singleton.config.clean);
  });
}

function Meanio() {
  if (this.active) return;
  Meanio.Singleton = this;
  this.version = require('../package').version;
  this.events = events;
}
Meanio.events = events;

Meanio.prototype.serve = function(options, callback) {
  if (this.active) return this;
  Meanio.Singleton.options = options;
  Meanio.Singleton.config = new (Meanio.Config)(util.loadConfig());
  Meanio.Singleton.active = true;
  Meanio.connectDBs(Meanio.Singleton.config.clean, doBootstrap.bind(null, callback));
};

Meanio.prototype.status = function() {
  return {
    active: this.active,
    name: this.name
  };
};

Meanio.prototype.register = container.register;
Meanio.prototype.get = container.get;
Meanio.prototype.loadConfig = function(){
  return this.config.clean;
};
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

(require('./config'))(Meanio);
(require('./menu'))(Meanio);
(require('./module'))(Meanio);
(require('./aggregation'))(Meanio);
(require('./db'))(Meanio);
(require('./platform'))(Meanio);

/*global exports:true*/
module.exports = exports = new Meanio();
/*global exports:false*/
