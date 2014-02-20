'use strict';

//Setting up route
angular.module('mean').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
        function($stateProvider, $urlRouterProvider,$locationProvider, $httpProvider) {

            //================================================
            // Check if the user is connected
            //================================================
            var checkLoggedin = function($q, $timeout, $http, $location){
                // Initialize a new promise
                var deferred = $q.defer();

                // Make an AJAX call to check if the user is logged in
                $http.get('/loggedin').success(function(user){
                    // Authenticated
                    if (user !== '0')
                        $timeout(deferred.resolve, 0);

                    // Not Authenticated
                    else {
                        $timeout(function(){deferred.reject();}, 0);
                        $location.url('/login');
                    }
                });

                return deferred.promise;
            };
            //================================================
            // Check if the user is not conntect
            //================================================
            var checkLoggedOut = function($q, $timeout, $http, $location){
                // Initialize a new promise
                var deferred = $q.defer();

                // Make an AJAX call to check if the user is logged in
                $http.get('/loggedin').success(function(user){
                    // Authenticated
                    if (user !== '0'){
                        $timeout(function(){deferred.reject();}, 0);
                        $location.url('/login');

                    }

                    // Not Authenticated
                    else {
                        $timeout(deferred.resolve, 0);

                    }
                });

                return deferred.promise;
            };
            //================================================


            // For unmatched routes:
            $urlRouterProvider.otherwise('/');

            // states for my app
            $stateProvider
                .state('all articles', {
                    url: '/articles',
                    templateUrl: 'views/articles/list.html',
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .state('create article', {
                    url: '/articles/create',
                    templateUrl: 'views/articles/create.html',
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .state('edit article', {
                    url: '/articles/:articleId/edit',
                    templateUrl: 'views/articles/edit.html',
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .state('article by id', {
                    url: '/articles/:articleId',
                    templateUrl: 'views/articles/view.html',
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .state('home', {
                    url: '/',
                    templateUrl: 'views/index.html'
                })
                .state('auth', {
                    templateUrl: 'views/auth/index.html'
                })
                .state('auth.login', {
                    url: '/login',
                    templateUrl: 'views/auth/login.html',
                    resolve: {
                        loggedin: checkLoggedOut
                    }
                })
                .state('auth.register', {
                    url: '/register',
                    templateUrl: 'views/auth/register.html',
                    resolve: {
                        loggedin: checkLoggedOut
                    }
                });
        }
    ])
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);