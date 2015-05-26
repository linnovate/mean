'use strict';
angular.module('mean.admin').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('users', {
                url: '/admin/users',
                templateUrl: 'admin/views/users.html',
                resolve: {
                  isAdmin: function(MeanUser) {
                      return MeanUser.checkAdmin();
                  }
                }
            }).state('themes', {
                url: '/admin/themes',
                templateUrl: 'admin/views/themes.html',
                resolve: {
                  isAdmin: function(MeanUser) {
                      return MeanUser.checkAdmin();
                  }
                }
            }).state('settings', {
                url: '/admin/settings',
                templateUrl: 'admin/views/settings.html',
                resolve: {
                  isAdmin: function(MeanUser) {
                      return MeanUser.checkAdmin();
                  }
                }
            }).state('modules', {
                url: '/admin/modules',
                templateUrl: 'admin/views/modules.html',
                resolve: {
                  isAdmin: function(MeanUser) {
                      return MeanUser.checkAdmin();
                  }
                }
            }).state('admin settings', {
		        url: '/admin/_settings',
		        templateUrl: 'admin/views/example.html',
            resolve: {
              isAdmin: function(MeanUser) {
                  return MeanUser.checkAdmin();
              }
            }
	        });
    }
]).config(['ngClipProvider',
    function(ngClipProvider) {
        ngClipProvider.setPath('../admin/assets/lib/zeroclipboard/dist/ZeroClipboard.swf');
    }
]);