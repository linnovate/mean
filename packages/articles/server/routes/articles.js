'use strict';

var articles = require('../controllers/articles');


module.exports = function(Articles, app, auth) {

    app.route('/articles')
        .get(auth.requiresAdmin, articles.all)
        .post(auth.requiresAdmin, articles.create);
        
    app.route('/articles/:articleId')
        .get(auth.requiresAdmin, articles.show)
        .put(auth.requiresAdmin, articles.update)
        .delete(auth.requiresAdmin, articles.destroy);

    // Finish with setting up the articleId param
    app.param('articleId', articles.article);
    
    app.route('/articles/api/upload')
        .post(auth.requiresAdmin, articles.upload);
    
    app.route('/categories')
        .get(auth.requiresAdmin, articles.categories);
    
};
