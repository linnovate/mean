'use strict';

angular.module('mean.controllers.login', [])
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
          $scope.loginError = 0;
          $rootScope.user = user;
          $rootScope.test = 'test';
          $rootScope.$emit('loggedin');
          $location.url('/');
          })
        .error(function(error) {
          $scope.loginError = 'Authentication failed.';
        });
    };
  }])
  .controller('RegisterCtrl', ['$scope','$rootScope','$http','$location', function($scope, $rootScope, $http, $location) {
    $scope.user = {};

    $scope.register = function(){
      $http.post('/register', {
        email: $scope.user.email,
        password: $scope.user.password,
        confirmPassword: $scope.user.confirmPassword,
        username: $scope.user.username,
        name: $scope.user.fullname
      })
        .success(function(){
          // No error: authentication OK
          $scope.registerError = 0;
          $rootScope.user = $scope.user.fullname;
          $rootScope.$emit('loggedin');
          $location.url('/');

        })
        .error(function(error){
          // Error: authentication failed
          if (error == 'Username already taken') {
            $scope.usernameError = error;
          }
          else {
            $scope.registerError = error;
             }


        });
    };
  }]);