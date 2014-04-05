'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', ['$window','$rootScope',
    function($window, $rootScope) {
    	var global = {
            user: $window.user,
            authenticated: !! $window.user,
            setUser: function(user) {
                this.user = user;
                this.authenticated = !! user;
                $rootScope.$broadcast('userChanged');
            }
        };
        return global;
    }
]);
