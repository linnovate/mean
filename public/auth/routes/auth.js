'use strict';

//Setting up route
angular.module('mean.auth').config(['$stateProvider',
    function($stateProvider) {
        //  Check if the user is not connetected
        var checkLoggedOut = function($http) {
            return $http.get('/loggedout');
        };

        // states for my app
        $stateProvider
            .state('auth', {
                abstract: true,
                templateUrl: 'public/auth/views/index.html'
            })
            .state('auth.signin', {
                url: '/signin',
                templateUrl: 'public/auth/views/signin.html',
                resolve: {
                    loggedin: checkLoggedOut
                },
                controller:'SigninCtrl'
            })
            .state('auth.register', {
                url: '/register',
                templateUrl: 'public/auth/views/register.html',
                resolve: {
                    loggedin: checkLoggedOut
                },
                controller:'RegisterCtrl'
            });
    }
]);
