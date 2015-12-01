'use strict';
angular.module('mean.admin').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('users', {
        url: '/admin/users',
        templateUrl: 'admin/views/users.html',
        requiredCircles: {
          circles: ['admin']
        }
      }).state('themes', {
        url: '/admin/themes',
        templateUrl: 'admin/views/themes.html',
        requiredCircles: {
          circles: ['admin']
        }
      }).state('settings', {
        url: '/admin/settings',
        templateUrl: 'admin/views/settings.html',
        requiredCircles: {
          circles: ['admin']
        }
      }).state('modules', {
        url: '/admin/modules',
        templateUrl: 'admin/views/modules.html',
        requiredCircles: {
          circles: ['admin']
        }
      }).state('admin settings', {
        url: '/admin/_settings',
        templateUrl: 'admin/views/example.html',
        requiredCircles: {
          circles: ['admin']
        }
      });
  }
  ]).config(['ngClipProvider',
      function(ngClipProvider) {
          ngClipProvider.setPath('../admin/assets/lib/zeroclipboard/dist/ZeroClipboard.swf');
      }
  ]);