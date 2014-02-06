'use strict';

angular.module('mean-controller-login', [])
  .controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
    // This object will be filled by the form
    $scope.user = {};

    // Register the login() function
    $scope.login = function(){
      $http.post('/login', {
        email: $scope.user.email,
        password: $scope.user.password
      })
        .success(function(user){
          // No error: authentication OK
          $rootScope.message = 'Authentication successful!';
          $location.url('/admin');
          $scope.DoSomeThingWithTheUser = user;
          })
        .error(function(){
          // Error: authentication failed
          $rootScope.message = 'Authentication failed.';
          $location.url('/login');
        });
    };
  });