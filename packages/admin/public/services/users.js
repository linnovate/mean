//Users service used for users REST endpoint
angular.module('mean').factory("Users", ['$resource',
    function($resource) {
        return $resource('/admin/users/:userId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);