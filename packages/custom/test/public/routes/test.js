'use strict';

angular.module('mean.test').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('test example page', {
      url: '/test/example',
      templateUrl: 'test/views/index.html'
    });
  }
]);
