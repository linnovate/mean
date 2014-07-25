'use strict';

angular.module('mean.__pkgName__').controller('__class__Controller', ['$scope', 'Global', '__class__',
  function($scope, Global, __class__) {
    $scope.global = Global;
    $scope.package = {
      name: '__pkgName__'
    };
  }
]);
