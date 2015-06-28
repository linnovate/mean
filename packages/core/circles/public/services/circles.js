'use strict';

//Circles service used for circles REST endpoint
angular.module('mean.circles').factory('Circles', ['$resource',
  function($resource) {
    return $resource('api/circles/:name', {
      name: '@name'
    }, {
      update: {
        method: 'PUT'
      },
      mine: {
        method: 'GET',
        isArray: false,
        url: '/api/circles/mine'
      },
      all: {
        method: 'GET',
        isArray: false,
        url: '/api/circles/all'
      }
    });
  }
]);
