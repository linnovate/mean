'use strict';

angular.module('mean.mail-templates').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('mailTemplates example page', {
      url: '/mailTemplates/example',
      templateUrl: 'mail-templates/views/index.html'
    });
  }
]);
