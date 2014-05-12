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
            .state('users.all users', {
                url: '/list',
                templateUrl: 'public/users/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                },
                data: {
                    displayName: false
                }
            })
            .state('users.create user', {
                url: '/create',
                templateUrl: 'public/users/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                },
                data: {
                    displayName: 'New user'
                }
            })
            .state('users.edit user', {
                url: '/:userId/edit',
                templateUrl: 'public/users/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                },
                data: {
                    displayName: '{{ user.title }}'
                }
            })
            .state('users.user by id', {
                url: '/:userId',
                templateUrl: 'public/users/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                },
                data: {
                    displayName: '{{ user.username }}'
                }
            }
        );
    }
]);
