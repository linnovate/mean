//Tue Jan 28 2014 11:35:31 GMT+0200 (IST)
'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global','$route', function ($scope, Global, $route) {
    console.log($route);
    $scope.global = Global;
}]);