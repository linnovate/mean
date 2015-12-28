'use strict';

//Setting up route
angular.module('mean.users').config(['$meanStateProvider', '$httpProvider', 'jwtInterceptorProvider',
  function($meanStateProvider, $httpProvider, jwtInterceptorProvider) {    
        
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  }
]);
