'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Comments, app, auth, database) {

  app.get('/comments/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/comments/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/comments/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/comments/example/render', function(req, res, next) {
    Comments.render('index', {
      package: 'comments'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
