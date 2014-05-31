'use strict';

angular.module('mean.users').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('users example page', {
            url: '/users/example',
            templateUrl: 'users/views/index.html'
        });
    }
]);
