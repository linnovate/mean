'use strict';

//Setting up route
angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $stateProvider
      .state('all articles', {
        url: '/articles',
            controller: 'ArticlesController',
            templateUrl: 'views/articles/list.html'
        })
        .state('create article', {
        url: '/articles/create',
            controller: 'ArticlesController',
            templateUrl: 'views/articles/create.html'
        })
        .state('edit article', {
        url: '/articles/:articleId/edit',
            controller: 'ArticlesController',
            templateUrl: 'views/articles/edit.html'
        })
        .state('article by id', {
        url: '/articles/:articleId',
            controller: 'ArticlesController',
            templateUrl: 'views/articles/view.html'
        })
        .state('home', {
        url: '/',
            controller: 'IndexController',
            templateUrl: 'views/index.html'
        });
  }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
}
]);
