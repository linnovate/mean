'use strict';

angular.module('mean.system').provider('$meanState', ['$stateProvider', '$viewPathProvider', function($stateProvider, $viewPathProvider) {
	this.state = function(stateName, data) {
		if (data.templateUrl) {
			data.templateUrl = $viewPathProvider.path(data.templateUrl);
		}
		$stateProvider.state(stateName, data);
		
		return this;
	};

	this.$get = function() {
		return this;
	};
}]);
