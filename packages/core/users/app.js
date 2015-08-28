'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
  Module = mean.Module;

function MeanUserKlass () {
  Module.call(this, 'users');
  this.auth = null;
}

MeanUserKlass.prototype = Object.create(Module.prototype,{constructor:{
  value:MeanUserKlass,
  configurable: false,
  enumerable: false,
  writable: false
}});

var MeanUser = new MeanUserKlass();

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
MeanUser.register(function(app, database, passport) {
    // This is for backwards compatibility
    MeanUser.aggregateAsset('js', '../lib/angular-jwt/dist/angular-jwt.min.js', {
        absolute: false,
        global: true
    });

    MeanUser.auth = require('./authorization');
    require('./passport')(passport);

    mean.register('auth', MeanUser.auth);

    //We enable routing. By default the Package Object is passed to the routes
    MeanUser.routes(app, MeanUser.auth, database, passport);

    MeanUser.angularDependencies(['angular-jwt']);

    MeanUser.events.defaultData({
        type: 'user'
    });

    return MeanUser;
});
