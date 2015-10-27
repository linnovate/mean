'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.articles').factory('Articles', ['$resource',
  function($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
