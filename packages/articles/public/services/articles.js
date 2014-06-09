'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.articles')
    .config(['RestangularProvider',function(RestangularProvider) {
        RestangularProvider.setBaseUrl('/');
        RestangularProvider.setRestangularFields({
            id: '_id'
        });
        RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
            if (operation === 'put') {
                elem._id = undefined;
                return elem;
            }
            return elem;
        }); 
    }])
    .factory('Articles', ['Restify', function(Restify) {
        function Articles() {}
        return angular.extend(Restify('articles'), new Articles());
    }]);
