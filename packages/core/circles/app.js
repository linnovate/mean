'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Circles = new Module('circles');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */

Circles.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Circles.routes(app, auth, database);

  Circles.aggregateAsset('css', 'circles.css');

  Circles.menus.add({
    title: 'Circles',
    link: 'manage circles',
    roles: ['authenticated'],
    menu: 'main'
  });

  ensureCirclesExist();

  return Circles;
});

function ensureCirclesExist() {

  var requiredCircles = ['annoymous', 'authenticated', 'admin'];
  var Circle = require('mongoose').model('Circle');
  requiredCircles.forEach(function(circle, index) {
    var query = {
      name: circle
    };

    var set = {};
    if (requiredCircles[index + 1]) {

      set.$push = {
        circles: requiredCircles[index + 1]
      };
    }

    Circle.findOne(query, function(err, data) {
      if (!err && !data) {
        Circle.findOneAndUpdate(query, set, {
          upsert: true
        }, function(err) {
          if (err) console.log(err);
        });
      }
    })

  });


}
/*
Y Override queries to check user permisisons
Y Add middleware for checking for specific circles by name
O Update user schema
O Update article schema
O Update admin page to assign circles to users
O Update article create + edit to assign circles (many) according to name (select list - of his circles)
O Page to create and manage circles

*/