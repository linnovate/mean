'use strict';

//Setting up route
angular.module('mean.auth').config(['$stateProvider',
    function($stateProvider) {
        //  Check if the user is not conntected
        var checkLoggedOut = function($q, $timeout, $http, $location) {
            return $http.get('/loggedout');
        };

        // states for my app
        $stateProvider
            .state('auth', {
                abstract: true,
                templateUrl: 'public/auth/views/index.html'
            })
            .state('auth.login', {
                url: '/login',
                templateUrl: 'public/auth/views/login.html',
                resolve: {
                    loggedin: checkLoggedOut
                },
                controller:'LoginCtrl'
            })
            .state('auth.signup', {
                url: '/register',
                templateUrl: 'public/auth/views/signup.html',
                resolve: {
                    loggedin: checkLoggedOut
                },
                controller:'SignUpCtrl'
            });
    }
]);
