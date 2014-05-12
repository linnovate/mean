'use strict';

angular.module('mean')
    .controller('UsersController', ['$scope','$rootScope', '$stateParams', '$location', '$http', 'Global', 'Users', '$state',
    function($scope, $rootScope, $stateParams, $location, $http, Global, Users, $state) {
        $scope.global = Global;
        $scope.user = {};

        $scope.create = function() {
            $scope.usernameError = null;
            $scope.createError = null;

            $http.post('/usercreate', {
                email: $scope.user.email,
                name: $scope.user.firstname + ' '  + $scope.user.lastname,
                password: $scope.user.password,
                confirmPassword: $scope.user.password,
                username: $scope.user.email,
                firstname: $scope.user.firstname,
                lastname: $scope.user.lastname,
                ui_settings: $scope.user.ui_settings
            })
                .success(function(){
                    $scope.createError = 0;
                    //$rootScope.user = $scope.user;
                    $state.go('users.all users');
                })
                .error(function(error){
                    // Error: authentication failed
                    if (error === 'Username already taken') {
                        $scope.usernameError = error;
                    } else {
                        $scope.createError = error;
                    }
                });
        };

        $scope.remove = function(user) {
            if (user) {
                user.$remove();

                for (var i in $scope.users) {
                    if ($scope.users[i] === user) {
                        $scope.users.splice(i, 1);
                    }
                }
            } else {
                $scope.user.$remove();
                $location.path('users');
            }
        };

        $scope.update = function() {
            var user = $scope.user;
            if (!user.updated) {
                user.updated = [];
            }
            user.updated.push(new Date().getTime());

            user.$update(function() {
                $location.path('users/' + user._id);
            });
        };

        $scope.find = function() {
            Users.query(function(users) {
                $scope.users = users;
            });
        };

        $scope.findOne = function() {
            Users.get({
                userId: $stateParams.userId
            }, function(user) {
                $scope.user = user;
            });
        };
    }
]);
