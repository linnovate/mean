//Mon Jan 27 2014 16:13:55 GMT+0200 (IST)
'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;
}]);