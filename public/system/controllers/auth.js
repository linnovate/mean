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
                    // authentication OK
                    $scope.loginError = 0;
                    $rootScope.user = user;
                    $rootScope.$emit('loggedin');
                    $location.url('/');
                })
                .error(function() {
                    $scope.loginerror = 'Authentication failed.';
                });
        };
    }])
    .controller('RegisterCtrl', ['$scope','$rootScope','$http','$location', function($scope, $rootScope, $http, $location) {
        $scope.user = {};

        $scope.register = function(){
            $scope.usernameError = null;
            $scope.registerError = null;
            $http.post('/register', {
                email: $scope.user.email,
                password: $scope.user.password,
                confirmPassword: $scope.user.confirmPassword,
                username: $scope.user.username,
                name: $scope.user.fullname
            })
                .success(function(){
                    // authentication OK
                    $scope.registerError = 0;
                    $rootScope.user = $scope.user.fullname;
                    $rootScope.$emit('loggedin');
                    $location.url('/');

                })
                .error(function(error){
                    // Error: authentication failed
                    if (error === 'Username already taken') {
                        $scope.usernameError = error;
                    }
                    else {
                        $scope.registerError = error;
                    }


                });
        };
    }]);