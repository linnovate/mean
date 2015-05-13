'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Test, app, auth, database) {

  app.get('/test/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/test/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/test/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/test/example/render', function(req, res, next) {
    Test.render('index', {
      package: 'test'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
