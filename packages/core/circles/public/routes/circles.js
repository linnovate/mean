'use strict';

angular.module('mean.circles').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('manage circles', {
      url: '/circles/manage',
      templateUrl: 'circles/views/index.html',
      requiredCircles: {
        circles: ['admin']
      }
    }).state('create circles', {
      url: '/circles/create',
      templateUrl: 'circles/views/create.html',
      requiredCircles: {
        circles: ['admin']
      }
    });
  }
])
  .run(['$rootScope', '$state', '$cookies', 'MeanUser', function($rootScope, $state, $cookies, MeanUser) {
      $rootScope.$on('$stateChangeStart', function(e, toState) {
        // If the route has a circle requirement on it validate it
        if(toState.requiredCircles && angular.isArray(toState.requiredCircles.circles)) {
          for(var j = 0; j < toState.requiredCircles.circles.length; j++) {
            var requiredCircle = toState.requiredCircles.circles[j];
            if(MeanUser.acl.allowed.indexOf(requiredCircle) === -1) {
              e.preventDefault();
              $state.go(toState.requiredCircles.denyState || 'home');
            }
          }
        }
      });
    }]
  );
