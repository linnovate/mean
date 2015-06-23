'use strict';

/* jshint -W098 */
angular.module('mean.circles').controller('CirclesController', ['$scope', 'Global', 'Circles',
  function($scope, Global, Circles) {
    $scope.global = Global;
    $scope.package = {
      name: 'circles'
    };
  }
]);
