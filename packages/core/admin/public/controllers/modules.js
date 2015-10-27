'use strict';

angular.module('mean.admin').controller('ModulesController', ['$scope', 'Global', '$rootScope', 'Menus', 'Modules',
    function($scope, Global, $rootScope, Menus, Modules) {

	    var vm = this;

	    $scope.modules = [];

	    vm.init = function() {
		    Menus.query({
			    name: 'modules',
			    defaultMenu: []
		    }, function(menu) {
			    vm.modules = menu;
		    });
	    };
    }
]);