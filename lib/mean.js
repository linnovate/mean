'use strict';

var Container = require('lazy-dependable').Container,
  Q = require('q');

function Meanio() {
  Container.call(this);
  if (this.active) return;
  Meanio.Singleton = this;
  this.version = require('../package').version;
  this.instanceWaitersQ = [];
  var defer;
  while(Meanio.instanceWaiters.length){
    defer = Q.defer();
    Meanio.instanceWaiters.shift()(this,defer);
    this.instanceWaitersQ.push(defer.promise);
  }
}
Meanio.prototype = Object.create(Container.prototype,{constructor:{
  value: Meanio,
  enumerable: false,
  writable: false,
  configurable: false
}});

Meanio.prototype.status = function() {
  return {
    active: this.active,
    name: this.name
  };
};

Meanio.prototype.loadConfig = function(){
  return this.config.clean;
};

Meanio.instanceWaiters = [];
Meanio.onInstance = function(func){
  Meanio.instanceWaiters.push(func);
};

(require('./core_modules/config'))(Meanio);
(require('./menu'))(Meanio);
(require('./core_modules/module'))(Meanio);
(require('./core_modules/db'))(Meanio);
(require('./core_modules/server'))(Meanio);

/*global exports:true*/
module.exports = exports = new Meanio();
/*global exports:false*/
