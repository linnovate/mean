'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope','$rootScope', 'Global', function ($scope, $rootScope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Articles',
        'link': 'all articles'
    }, {
        'title': 'Create New Article',
        'link': 'create article'
    }];

    $scope.isCollapsed = false;

    $rootScope.$on('loggedin',function () {
        $scope.global = {
            authenticated: !! $rootScope.user,
            user: $rootScope.user
        };
    });

}]);