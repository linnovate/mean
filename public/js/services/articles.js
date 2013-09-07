//Articles service used for articles REST endpoint
angular.module('mean.articles').factory("Articles", function($resource) {
    return $resource('articles/:articleId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
});