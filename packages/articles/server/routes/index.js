'use strict';

var articles = require('../controllers/articles');

// The Package is past automatically as first parameter
module.exports = function(Articles, app, auth, database) {

    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, articles.update);
    app.del('/articles/:articleId', auth.requiresLogin, articles.destroy);

    // Finish with setting up the articleId param
    app.param('articleId', articles.article);

};
