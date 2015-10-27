'use strict';

/* jshint -W098 */
angular.module('mean.i18n').controller('I18nController', ['$scope', 'Global', 'I18n',
  function($scope, Global, I18n) {
    $scope.global = Global;
    $scope.package = {
      name: 'i18n'
    };
  }
]);
