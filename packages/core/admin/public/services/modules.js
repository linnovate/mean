'use strict';
angular.module('mean.admin').factory('Modules', ['$http',
    function($http) {
        return {
            get: function(callback) {
                $http.get('/api/admin/modules')
                    .then(function(response) {
                        callback(response.data);
                    });
            }
        };
    }
]);
