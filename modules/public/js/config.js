//Mon Jan 27 2014 16:13:55 GMT+0200 (IST)
'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/404', {
            templateUrl: '/404/views/index.html'

        })       
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);