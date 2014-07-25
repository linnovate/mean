'use strict';

// The Package is past automatically as first parameter
module.exports = function(__class__, app, auth, database) {

  app.get('/__name__/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/__name__/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/__name__/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/__name__/example/render', function(req, res, next) {
    __class__.render('index', {
      package: '__pkgName__'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
