//Tue Jan 28 2014 11:35:31 GMT+0200 (IST)
'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/404', {
            templateUrl: 'example/views/index.html'

        }).otherwise({
         	templateUrl: 'example/views/index.html'   
        });       
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);