'use strict';

angular.module('mean.slack').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('slack example page', {
            url: '/slack/example',
            templateUrl: 'slack/views/index.html'
        });
    }
]);
