'use strict';

angular.module('mean.system').controller('IndexCtrl', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;
}]);