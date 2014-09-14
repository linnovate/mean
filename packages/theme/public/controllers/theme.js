'use strict';

angular.module('mean.theme')
	.controller('ThemeController', ['$scope', 'Global', '$location', '$rootScope',
	  function($scope, Global, $location, $rootScope) {
	 		$rootScope.$on('$stateChangeStart',
      	function(event, toState, toParams, fromState, fromParams){
          var elements = $location.path().split('/');
          var lastElement = elements.slice(-1)[0];
        	$scope.state = toState;
        	if($scope.state === '' ) {
          	$scope.state = 'firstPage';
        	}
        	console.log($scope.state);
    		});
// Original scaffolded code.
      $scope.global = Global;
      $scope.package = {
        name: 'theme'
      };
    }
  ]);