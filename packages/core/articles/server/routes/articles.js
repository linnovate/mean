'use strict';

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && !req.article.user._id.equals(req.user._id)) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

var hasPermissions = function(req, res, next) {

    req.body.permissions = req.body.permissions || ['authenticated'];

    for (var i = 0; i < req.body.permissions.length; i++) {
      var permission = req.body.permissions[i];
      if (req.acl.user.allowed.indexOf(permission) === -1) {
            return res.status(401).send('User not allowed to assign ' + permission + ' permission.');
        };
    };

    next();
};

module.exports = function(Articles, app, auth) {
  
  var articles = require('../controllers/articles')(Articles);

  app.route('/api/articles')
    .get(articles.all)
    .post(auth.requiresLogin, hasPermissions, articles.create);
  app.route('/api/articles/:articleId')
    .get(auth.isMongoId, articles.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, articles.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, articles.destroy);

  // Finish with setting up the articleId param
  app.param('articleId', articles.article);
};
