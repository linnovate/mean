'use strict';

angular.module('mean.theme').controller('ThemeController', ['$scope', 'Global', 'Theme',
  function($scope, Global, Theme) {
    $scope.global = Global;
    $scope.package = {
      name: 'theme'
    };
  }
]);
