'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus',
    function($scope, $rootScope, Global, Menus) {
        $scope.global = Global;

        $scope.menus = {
            main: [{
                'roles': ['authenticated'],
                'title': 'Articles',
                'link': 'all articles'
            }, {
                'roles': ['authenticated'],
                'title': 'Create New Article',
                'link': 'create article'
            }]
        }

        Menus.query({
            name: 'main'
        }, function(mainMenu) {
            $scope.menus.main = $scope.menus.main.concat(mainMenu);
        });

        $scope.isCollapsed = false;

        $rootScope.$on('loggedin', function() {
            $scope.global = {
                authenticated: !! $rootScope.user,
                user: $rootScope.user
            };
        });

    }
]);