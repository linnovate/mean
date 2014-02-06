'use strict';

//Setting up route
angular.module('mean').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
  function($stateProvider, $urlRouterProvider,$locationProvider, $httpProvider) {

    //================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
          $timeout(deferred.resolve, 0);

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          $timeout(function(){deferred.reject();}, 0);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };
    //================================================
    // Check if the user is not conntect
    //================================================
    var checkLoggedOut = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0'){
          $timeout(function(){deferred.reject();}, 0);
          $location.url('/login');

        }

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          $timeout(deferred.resolve, 0);

        }
      });

      return deferred.promise;
    };
    //================================================

    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.responseInterceptors.push(function($q, $location) {
      return function(promise) {
        return promise.then(
          // Success: just return the response
          function(response){
            return response;
          },
          // Error: check the error status to get only the 401
          function(response) {
            if (response.status === 401)
              $location.url('/login');
            return $q.reject(response);
          }
        );
      };
    });

    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $stateProvider
      .state('all articles', {
        url: '/articles',
        templateUrl: 'views/articles/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create article', {
        url: '/articles/create',
        templateUrl: 'views/articles/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit article', {
        url: '/articles/:articleId/edit',
        templateUrl: 'views/articles/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('article by id', {
        url: '/articles/:articleId',
        templateUrl: 'views/articles/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('home', {
        url: '/',
        templateUrl: 'views/index.html'
      })
      .state('auth', {
        templateUrl: 'views/auth/index.html'
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: 'views/auth/login.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: 'views/auth/register.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      });
  }
])
.config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
])
.run(['$rootScope','$http', function ($rootScope,$http) {
  $rootScope.message = '';
    // Logout is available anywhere
    $rootScope.logout = function () {
      $rootScope.message = 'Logged out';
      $http.post('/logout');
    };
}]);