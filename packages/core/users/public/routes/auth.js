'use strict';

//Setting up route
angular.module('mean.users').config(['$meanStateProvider', '$httpProvider', 'jwtInterceptorProvider',
  function($meanStateProvider, $httpProvider, jwtInterceptorProvider) {    
        
    /*var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6ImZhY2Vib29rfDEwMTU0Mjg3MDI3NTEwMzAyIiwiYXVkIjoiQlVJSlNXOXg2MHNJSEJ3OEtkOUVtQ2JqOGVESUZ4REMiLCJleHAiOjE0MTIyMzQ3MzAsInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJpYXQiOjE0MTIxOTg3MzB9.egsc0YfweH_O9cpOApAkYbAw58buECpjDG77hfDUS_0';
    localStorage.setItem('refreshToken', 'refresher');
    localStorage.setItem('JWT', token);*/
    
    /*jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http) {
      var jwt = localStorage.getItem('JWT');
      var refreshToken = localStorage.getItem('refresh_token');
      if (jwtHelper.isTokenExpired(jwt)) {
        // This is a promise of a JWT id_token
        return $http({
          url: '/delegation',
          // This will not send the JWT for this call
          skipAuthorization: true,
          method: 'POST',
          refresh_token : refreshToken
        }).then(function(response) {
          localStorage.setItem('JWT', response.data.jwt);
          return jwt;
        });
      } else {
        return jwt;
      }
    };  */

    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    // Check if the user is not connected
    var checkLoggedOut = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user) {
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
    $meanStateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: 'users/views/index.html'
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: 'users/views/login.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: 'users/views/register.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'users/views/forgot-password.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('reset-password', {
        url: '/reset/:tokenId',
        templateUrl: 'users/views/reset-password.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      });
  }
]);