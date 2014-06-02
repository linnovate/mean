'use strict';

angular.module('mean.system')
    .factory('Menus', ['$http', function($http) {
        return {
            query : function(name,defaultMenu){
                return $http.get('/admin/menu/'+name, {
                    params: {
                        'defaultMenu[]': defaultMenu
                    }
                });
            }
        }; 
    }]);