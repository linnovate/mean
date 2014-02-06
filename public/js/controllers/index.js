'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$http', 'Global',
    function($scope, $http, Global) {
        $scope.global = Global;
        $http.jsonp('https://api.github.com/repos/linnovate/mean?callback=JSON_CALLBACK').success(function(data) {
            $scope.githubData = data;
        });
    }
]);
