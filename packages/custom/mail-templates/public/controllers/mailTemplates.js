'use strict';

/* jshint -W098 */
angular.module('mean.mail-templates').controller('MailTemplatesController', ['$scope', 'Global', 'MailTemplates',
  function($scope, Global, MailTemplates) {
    $scope.global = Global;
    $scope.package = {
      name: 'mail-templates'
    };
  }
]);
