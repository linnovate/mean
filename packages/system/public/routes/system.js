'use strict';

angular.module('mean.system').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('system example page', {
            url: '/system/example',
            templateUrl: 'system/views/index.html'
        });
    }
]);
