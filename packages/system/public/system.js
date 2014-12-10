'use strict';

angular.module('mean.system', ['ui.router', 'mean-factory-interceptor'])
  .run(['$rootScope', function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      var toPath = toState.url.replace('/','');
      toPath = toPath.replace(':','-');
      $rootScope.state = toPath;
      if($rootScope.state === '' ) {
        $rootScope.state = 'firstPage';
      }
    });
  }])
;
