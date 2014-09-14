'use strict';

angular.module('mean.theme').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('theme example page', {
      url: '/theme/example',
      templateUrl: 'theme/views/index.html'
    });
  }
]);
