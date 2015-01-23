angular.module('mean.comments')
.directive('commentList', function() {
  return {
    restrict: 'E',
    templateUrl: '../comments/views/list.html',
    scope: {
      articleId: '='
    }
  };
});