'use strict';

angular.module('company')
  .controller('RegisterController', ['$scope', 'PCSelector', function($scope, PCSelector) {
    $scope.pcSelector = new PCSelector.PCSelector();
  }]);