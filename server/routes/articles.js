'use strict';

// Articles routes use articles controller
var articles = require('../controllers/articles');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (req.article.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.route('/articles')
        .get(articles.all)
        .post(authorization.requiresLogin, articles.create);
    app.route('/articles/:articleId')
        .get(articles.show)
        .put(authorization.requiresLogin, hasAuthorization, articles.update)
        .delete(authorization.requiresLogin, hasAuthorization, articles.destroy);

    // Finish with setting up the articleId param
    app.param('articleId', articles.article);

};