'use strict';
angular.module('mean.admin').factory('Modules', ['$http',
    function($http) {
        return {
            get: function(callback) {
                $http.get('/api/admin/modules')
                    .success(function(data) {
                        callback(data);
                    });
            }
        };
    }
]);