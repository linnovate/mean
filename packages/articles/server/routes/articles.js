'use strict';

var articles = require('../controllers/articles');

module.exports = function(Articles, app, auth) {

  app.route('/articles')
    .get(articles.all)
    .post(auth.requiresLogin, articles.create);
  app.route('/articles/:articleId')
    .get(articles.show)
    .put(auth.requiresLogin, articles.hasAuthorization(['admin', 'authenticated']), articles.update)
    .delete(auth.requiresLogin, articles.hasAuthorization(['admin', 'authenticated']), articles.destroy);

  // Finish with setting up the articleId param
  app.param('articleId', articles.article);
};
