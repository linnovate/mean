'use strict';

angular.module('mean').controller('__class__Controller', ['$scope', 'Global',
    function($scope, Global, __class__) {
        $scope.global = Global;
        $scope.__name__ = {
            name: '__name__'
        };
    }
]);
