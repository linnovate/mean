'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', [

    function() {
        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: window.user && window.user.roles,
            isAdmin: (window.user && window.user.roles) && window.user.roles.indexOf('admin') > -1
        };
        return _this._data;
    }
]);
