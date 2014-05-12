'use strict';

//Setting up route
angular.module('mean').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is connected
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        // states for my app
        $stateProvider
            .state('all users', {
                url: '/users',
                templateUrl: 'public/users/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create user', {
                url: '/users/create',
                templateUrl: 'public/users/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit user', {
                url: '/:userId/edit',
                templateUrl: 'public/users/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('user by id', {
                url: '/users/:userId',
                templateUrl: 'public/users/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            }
        );
    }
]);
