'use strict';

//Lista service used for list categories REST endpoint
angular.module('mean.articles').factory('Categories', ['Restify', function(Restify) {
    function Categories() {
    }
    return angular.extend(Restify('categories'), new Categories());
}]);
