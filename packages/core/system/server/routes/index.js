'use strict';

var mean = require('meanio');
var menus = require('../controllers/menus');


module.exports = function(System, app, auth, database) {

  // Home route
  var index = require('../controllers/index');
  app.route('/')
    .get(menus.get, index.render);

  app.get('/*',function(req,res,next){
        res.header('workerID' , JSON.stringify(mean.options.workerid) );
        next(); // http://expressjs.com/guide.html#passing-route control
  });
};
