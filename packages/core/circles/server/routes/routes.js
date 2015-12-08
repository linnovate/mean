'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Circles, app, auth, database) {

  var circles = Circles.controller;

  app.use(circles.loadCircles);
	app.use(circles.userAcl);
	app.use(circles.aclBlocker);


  app.get('/api/test', circles.test);
  app.get('/api/circles/visualize', circles.visualize);
  app.get('/api/circles/tree', circles.tree);
  app.get('/api/circles/mine', circles.mine);
  app.get('/api/circles/all', circles.hasCircle('admin'), circles.all);

  app.route('/api/circles/:name')
      .post(circles.hasCircle('admin'), circles.create)
      .put(circles.hasCircle('admin'), circles.update)
      .get(circles.show);
};
