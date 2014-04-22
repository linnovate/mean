'use strict';

angular.module('mean').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('__name__ example page', {
            url: '/__name__/example',
            templateUrl: '__name__/views/index.html'
        });
    }
]);
