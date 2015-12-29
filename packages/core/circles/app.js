'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var mongoose = require('mongoose');

var Circles = new Module('circles');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */

Circles.register(function(app, auth, database) {

  Circles.controller = require('./server/controllers/circles')(Circles, app);
  Circles.registerCircle = registerCircle;
  Circles.routes(app, auth, database);
  Circles.aggregateAsset('css', 'circles.css');
  Circles.angularDependencies(['mean.users', 'mean.system']);

  Circles.menus.add({
    title: 'Circles',
    link: 'manage circles',
    roles: ['authenticated', 'admin'],
    menu: 'main'
  });

  Circles.models = {};

  Circles.registerCircle('admin');
  Circles.registerCircle('can delete content', ['admin']);
  Circles.registerCircle('can edit content', ['admin']);
  Circles.registerCircle('can create content', ['admin']);
  Circles.registerCircle('authenticated');
  Circles.registerCircle('anonymous');

  return Circles;
});

function registerCircle(name, parents) {
  var Circle = require('mongoose').model('Circle');

  var query = { name: name };
  var set = {};
  if(parents) {
    set.$push = {
      circles: parents
    };
  }

  Circle.findOne(query, function(err, data) {
    if (!err && !data) {
      Circle.findOneAndUpdate(query, set, {
        upsert: true
      }, function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

/*
Y Override queries to check user permisisons
Y Add middleware for checking for specific circles by name
O Page to create and manage circles + sow circles heirarchy
*/
