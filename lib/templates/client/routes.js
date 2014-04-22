'use strict';

angular.module('mean').config(['$stateProvider',
    function($stateProvider) {
	$stateProvider.state('{{name}} example page', {
	    url: '/{{name}}/example',
	    templateUrl: '{{name}}/views/index.html'
	  });
      }
]);
