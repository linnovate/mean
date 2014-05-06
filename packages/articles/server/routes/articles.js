'use strict';

var articles = require('../controllers/articles');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (req.article.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Articles, app, auth) {
    
    app.route('/articles')
        .get(articles.all)
        .post(auth.requiresLogin, articles.create);
    app.route('/articles/:articleId')
        .get(articles.show)
        .put(auth.requiresLogin, hasAuthorization, articles.update)
        .delete(auth.requiresLogin, hasAuthorization, articles.destroy);

    // Finish with setting up the articleId param
    app.param('articleId', articles.article);
};
