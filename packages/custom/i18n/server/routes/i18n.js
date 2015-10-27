'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(I18n, app, auth, database) {

  app.get('/api/i18n/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/api/i18n/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/i18n/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/api/i18n/example/render', function(req, res, next) {
    I18n.render('index', {
      package: 'i18n'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
