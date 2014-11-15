'use strict';

//Setting up route
angular.module('mean.system').config(['$meanStateProvider', '$urlRouterProvider',
  function($meanStateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $meanStateProvider
      .state('home', {
        url: '/',
        templateUrl: 'system/views/index.html'
      });
  }
]).config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
