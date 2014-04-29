'use strict';

angular.module('mean').controller('UsersController', ['$scope', 'Global', 'Menus', '$rootScope', '$http', 'Users',
    function($scope, Global, Menus, $rootScope, $http, Users) {
        $scope.global = Global;
        $scope.userSchema = [{
            title: 'Email',
            schemaKey: 'email',
            type: 'text',
            inTable: true
        }, {
            title: 'Name',
            schemaKey: 'name',
            type: 'text',
            inTable: true
        }, {
            title: 'Username',
            schemaKey: 'username',
            type: 'text',
            inTable: true
        }, {
            title: 'Roles',
            schemaKey: 'roles',
            type: 'select',
            inTable: true
        }, {
            title: 'Password',
            schemaKey: 'password',
            type: 'password',
            inTable: false
        }, {
            title: 'Repeat password',
            schemaKey: 'confirmPassword',
            type: 'password',
            inTable: false
        }];
        $scope.roles = ['authenticated', 'admin'];
        $scope.user = {};

        $scope.init = function() {
            Users.query({}, function(users) {
                $scope.users = users;
            });
        };

        $scope.add = function() {
            if (!$scope.users) $scope.users = [];

            var user = new Users({
                email: $scope.user.email,
                name: $scope.user.name,
                username: $scope.user.username,
                password: $scope.user.password,
                confirmPassword: $scope.user.confirmPassword,
                roles: $scope.user.roles
            });

            user.$save(function(response) {
                $scope.users.push(response);
            });

            this.firstName = this.lastName = this.email = this.password = this.role = "";
        };

        $scope.remove = function(user) {
            for (var i in $scope.users) {
                if ($scope.users[i] == user) {
                    $scope.users.splice(i, 1);
                }
            }

            user.$remove();
        };

        $scope.update = function(user) {
            user.$update();
        };

    }
]);