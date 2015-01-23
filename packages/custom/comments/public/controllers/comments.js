'use strict';

/* jshint -W098 */
angular.module('mean.comments').controller('CommentsController', ['$scope', 'Global', 'Comments',
  function($scope, Global, Comments) {
    $scope.global = Global;
    $scope.package = {
      name: 'comments'
    };
  }
]);
