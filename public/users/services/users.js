'use strict';

//Sections service used for sections REST endpoint
angular.module('mean').factory('Users', ['$resource',
	function($resource) {
		return $resource('users/:userId', {
			userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
