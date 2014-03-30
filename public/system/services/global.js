'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', [
    function() {
        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: !! window.user,
            roles: window.userRoles,
            hasRole : function(role) { 
            	return (role == 'annonymous' || window.roles.indexOf('admin') != -1 || window.roles.indexOf(role) != -1)
            }
        };

        return _this._data;
    }
]);
