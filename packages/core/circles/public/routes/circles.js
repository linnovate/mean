'use strict';

angular.module('mean.circles').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('manage circles', {
      url: '/manage/circles',
      templateUrl: 'circles/views/index.html'
    });
  }
]);
