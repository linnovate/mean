'use strict';

angular.module('mean').controller('ThemesController', ['$scope', 'Global', '$rootScope', '$http',
    function($scope, Global, $rootScope, $http) {
        $scope.global = Global;
        $scope.themes = [];

        $scope.init = function() {
            $http({
                method: 'GET',
                url: 'http://api.bootswatch.com/3/'
            }).
            success(function(data, status, headers, config) {
                $scope.themes = data.themes;
            }).
            error(function(data, status, headers, config) {

            });
        };

        $scope.changeTheme = function(theme) {
            $('link').attr('href', theme.css);
            $scope.selectedTheme = theme;
        };

        $scope.save = function() {
            $http.get('/admin/themes?theme=' + $scope.selectedTheme.css).
            success(function(data, status, headers, config) {
                if (data)
                    alert('theme saved');
            }).
            error(function(data, status, headers, config) {
                alert('error');
            });
        };
    }
]);