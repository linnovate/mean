'use strict';

angular.module('mean').controller('ModulesController', ['$scope', 'Global', '$rootScope', '$http',
    function($scope, Global, $rootScope, $http) {
        $scope.oneAtATime = true;
        $scope.modules = window.modules;
    }
]);