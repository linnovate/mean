'use strict';

//Setting up route
angular.module('mean.system').config(['$stateProvider', '$urlRouterProvider', '$viewPathProvider',
  function($stateProvider, $urlRouterProvider, $viewPathProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: $viewPathProvider.path('system/views/index.html')
      });
  }
]).config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
