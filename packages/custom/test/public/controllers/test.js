'use strict';

/* jshint -W098 */
angular.module('mean.test').controller('TestController', ['$scope', 'Global', 'Test',
  function($scope, Global, Test) {
    $scope.global = Global;
    $scope.package = {
      name: 'test'
    };
  }
]);
