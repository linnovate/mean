'use strict';

(function(){
  var app = angular.module('img_list', []);
  var getData;
  app.controller('ImgCtrl', ['$scope', '$http', function($scope, $http) {
    var photo_album_id = $('#photo_album_id').val();
    $scope.photos = [];
    getData = function() {
      $http.get('/photoAlbum/' + photo_album_id + '/photolist')
      .success(function(data, status) {
        $scope.photos = data.data;
        for (var i = 0; i < $scope.photos.length; i++) {
          $scope.photos[i].action = '/photoAlbum/' + photo_album_id + '/photo/' + $scope.photos[i].pid;
        }
      });
    };
    getData();

    $('.js_ajax_form').ajaxForm(function() {
      getData();
    });

  }]);

  app.directive('finishRepeatDirective', function() {
    return function(scope, element, attrs) {
      $(element).find('.js_ajax_form').ajaxForm(function() {
        getData();
      });
    };
  });
}());
