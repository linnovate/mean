'use strict';

angular.module('mean.auth')
    .controller('SigninCtrl', ['$scope', '$rootScope', '$http', '$location',
        function($scope, $rootScope, $http, $location) {
            // This object will be filled by the form
            $scope.user = {};
            $scope.error = '';
            // Register the login() function
            $scope.login = function() {
                $http.post('/signin', $scope.user)
                    .success(function(response) {
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');
                        $location.url('/');
                    })
                    .error(function() {
                        $scope.error = 'Authentication failed.';
                    });
            };
        }
    ])
    .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location',
        function($scope, $rootScope, $http, $location) {
            $scope.user = {};
            $scope.errors = [];
            $scope.hasErrors = false;
            $scope.save = function() {
                $http.post('/register',$scope.user)
                .success(function() {
                    $rootScope.user = $scope.user;
                    $rootScope.$emit('loggedin');
                    $location.url('/');
                })
                .error(function(errors) {
                    $scope.hasErrors = true;
                    $scope.errors = errors;
                });
            };
        }
        ]);