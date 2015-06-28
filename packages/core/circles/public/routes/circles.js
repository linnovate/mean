'use strict';

angular.module('mean.circles').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('manage circles', {
      url: '/circles/manage',
      templateUrl: 'circles/views/index.html'
    }).state('create circles', {
      url: '/circles/create',
      templateUrl: 'circles/views/create.html'
    });
  }
]);
