'use strict';

angular.module('mean.theme').config(['$stateProvider', '$viewPathProvider',
  function($stateProvider, $viewPathProvider) {
    $stateProvider.state('theme example page', {
      url: '/theme/example',
      templateUrl: $viewPathProvider.path('theme/views/index.html')
    });
  }
]);
