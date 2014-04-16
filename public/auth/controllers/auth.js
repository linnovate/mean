'use strict';

angular.module('mean.controllers.login', [])
    .controller('LoginCtrl', ['$scope','$http','$location','Global', function($scope, $http, $location, Global) {
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
                    Global.setUser(user);
                    $location.url('/');
                })
                .error(function() {
                    $scope.loginerror = 'Authentication failed.';
                });
        };
    }])
    .controller('RegisterCtrl', ['$scope','$http','$location','Global', function($scope, $http, $location, Global) {
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
                    Global.setUser($scope.user.fullname);
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