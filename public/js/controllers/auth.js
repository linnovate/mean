'use strict';

angular.module('mean-controller-login', [])
  .controller('LoginCtrl', ['$scope','$rootScope','$http','$location', function($scope, $rootScope, $http, $location) {
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
          $scope.loginerror = 0;
          $rootScope.user = user;
          $rootScope.$emit('loggedin');
          $location.url('/');
          })
        .error(function(){
          // Error: authentication failed
          $scope.loginerror = 'Authentication failed.';
          $location.url('/login');
        });
    };
    $scope.register = function(){
      $http.post('/register', {
        email: $scope.user.email,
        password: $scope.user.password,
        confirmPassword: $scope.user.confirmPassword,
        username: $scope.user.username,
        name: $scope.user.fullname
      })
        .success(function(user){
          // No error: authentication OK
          $scope.registererror = 0;
          $rootScope.user = user;
          $rootScope.$emit('loggedin');
          $location.url('/');

        })
        .error(function(){
          // Error: authentication failed
          $scope.registerror = 'Registration failed.';
          $location.url('/register');
        });
    };
  }]);