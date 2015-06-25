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

  Circles.models = {};

  Circles.routes(app, auth, database);

  Circles.aggregateAsset('css', 'circles.css');

  Circles.menus.add({
    title: 'Circles',
    link: 'manage circles',
    roles: ['authenticated'],
    menu: 'main'
});

  Circles.models = {};

  ensureCirclesExist();

  return Circles;
});

<<<<<<< HEAD
=======
 function aclBlocker(req, res, next) {

    if (!req.acl) req.acl = {};

    req.acl.hasPermission =  function(name) {};
    req.acl.find = function() {

      var model = arguments['0'],
      callback = arguments['3'] || arguments['2'] || arguments['1'],
      fields = arguments['3'] ? arguments['2'] : {},
      query = arguments['2'] ? arguments['1'] : {};

      if (!Circles.models[model]) {
        Circles.models[model] = mongoose.model(model);
    }

    query.premissions = {
        $in: req.user ? req.user.roles || [] : []
    };

        Circles.models[model].find(query, fields, callback);
    };
    next();
}
>>>>>>> b9dc6238ba33b285958a8dfd3fb04ca7c4c3e2bf

function ensureCirclesExist() {

  var requiredCircles = ['annonymous', 'authenticated', 'can create content', 'can edit content', 'can delete content', 'admin'];
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
O Page to create and manage circles + sow circles heirarchy
*/