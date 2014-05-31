'use strict';

angular.module('mean.users').controller('UsersController', ['$scope', 'Global',
    function($scope, Global, Users) {
        $scope.global = Global;
        $scope.package = {
            name: 'users'
        };
    }
]);
