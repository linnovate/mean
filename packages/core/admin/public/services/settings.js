'use strict';

angular.module('mean.admin').factory('Settings', ['$http',
    function($http) {
        var get = function(callback) {
        // Temporary - probably it should to be resource based.
            $http.get('/api/admin/settings').then(function(response) {
                var data = response.data;
                callback({
                    success: true,
                    settings: data
                });
            }).catch(function(response) {
                callback({
                    success: false
                });
            });
        };
        var update = function(settings, callback) {
            $http.put('/api/admin/settings', settings).then(function(response) {
                callback(response.data);
            }).catch(function(response) {
                callback(response.data);
            });
        };
        return {
            get: get,
            update: update
        };
    }
]);
