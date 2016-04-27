(function() {
  'use strict';

  function StarterController($scope, Global) {
    // Original scaffolded code.
    $scope.global = Global;
    $scope.package = {
      name: 'meanStarter'
    };
  }

  angular.module('mean.meanStarter').controller('StarterController', StarterController);

  StarterController.$inject = ['$scope', 'Global'];
})();
