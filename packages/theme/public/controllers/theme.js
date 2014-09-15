'use strict';

angular.module('mean.theme')
	.controller('ThemeController', ['$scope', 'Global', '$location', '$rootScope',
	  function($scope, Global, $location, $rootScope) {
	 		$rootScope.$on('$stateChangeStart',
      	function(event, toState, toParams, fromState, fromParams){
					var toPath = toState.url.replace('/','');
        	$scope.state = toPath;
        	if($scope.state === '' ) {
          	$scope.state = 'firstPage';
        	}
    		});
// Original scaffolded code.
      $scope.global = Global;
      $scope.package = {
        name: 'theme'
      };
    }
  ]);
