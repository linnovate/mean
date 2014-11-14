'use strict';

//Setting up route
angular.module('mean.users').config(['$stateProvider', '$viewPathProvider',
  function($stateProvider, $viewPathProvider) {
    // Check if the user is not connected
    var checkLoggedOut = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') {
          $timeout(deferred.reject);
          $location.url('/login');
        }

        // Not Authenticated
        else $timeout(deferred.resolve);
      });

      return deferred.promise;
    };


    // states for my app
    $stateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: $viewPathProvider.path('users/views/index.html')
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: $viewPathProvider.path('users/views/login.html'),
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: $viewPathProvider.path('users/views/register.html'),
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: $viewPathProvider.path('users/views/forgot-password.html'),
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('reset-password', {
        url: '/reset/:tokenId',
        templateUrl: $viewPathProvider.path('users/views/reset-password.html'),
        resolve: {
          loggedin: checkLoggedOut
        }
      });
  }
]);
