'use strict';

//Questions service used for questions REST endpoint
angular.module('mean.questions').factory('Questions', ['$resource', function($resource) {
    return $resource('questions/:questionId', {
        questionId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);