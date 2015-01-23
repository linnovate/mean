'use strict';

angular.module('mean.comments').service('Comments', ['$resource',
  function($resource) {
    this.single = $resource('comments/:commentId', {
      commentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
    this.list = $resource('comments/list/:articleId', {
      articleId: '@_id'
    });
  }
]);
