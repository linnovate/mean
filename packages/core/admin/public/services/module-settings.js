'use strict';
angular.module('mean.admin').factory('ModuleSettings', ['$http', '$q',
	function($http, $q) {
		return {
			get: function(name) {
				var deferred = $q.defer();
				$http.get('/api/admin/moduleSettings/' + name)
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(data) {
						deferred.reject(data);
					});
				return deferred.promise;
			},
			update: function(name, data) {
				var deferred = $q.defer();
				$http.put('/api/admin/moduleSettings/' + name, data)
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(data) {
						deferred.reject(data);
					});
				return deferred.promise;
			},
			save: function(name, data) {
				var deferred = $q.defer();
				$http.post('/api/admin/moduleSettings/' + name, data)
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(data) {
						deferred.reject(data);
					});
				return deferred.promise;
			}
		};
	}
]);