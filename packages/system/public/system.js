'use strict';

angular.module('mean.system', ['ui.router', 'mean-factory-interceptor'])
  .run(['$rootScope', '$window', function($rootScope, $window) {
    $rootScope.$title = $window.defaultTitle;
  }])
;
