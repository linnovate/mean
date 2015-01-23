'use strict';

angular.module('mean.comments').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('comments example page', {
      url: '/comments/example',
      templateUrl: 'comments/views/index.html'
    });
  }
]);
