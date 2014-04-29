'use strict';

angular.module('mean').controller('AdminController', ['$scope', 'Global', 'Menus', '$rootScope',
    function($scope, Global, Menus, $rootScope) {
        $scope.global = Global;
        $scope.menus = {};

        // Default hard coded menu items for main menu
        var defaultAdminMenu = [{
            'roles': ['admin'],
            'title': 'MODULES',
            'link': 'modules',
            'subItems': $scope.global.modules
        }, {
            'roles': ['admin'],
            'title': 'THEMES',
            'link': 'themes'
        }, {
            'roles': ['admin'],
            'title': 'SETTINGS',
            'link': 'settings'
        }, {
            'roles': ['admin'],
            'title': 'USERS',
            'link': 'users'
        }];

        // Query menus added by modules. Only returns menus that user is allowed to see.

        function queryMenu(name, defaultMenu) {

            Menus.query({
                name: name,
                defaultMenu: defaultMenu
            }, function(menu) {
                $scope.menus[name] = menu;
            });
        }

        // Query server for menus and check permissions
        queryMenu('admin', defaultAdminMenu);

        $scope.isCollapsed = false;

        $rootScope.$on('loggedin', function() {

            queryMenu('admin', defaultAdminMenu);

            $scope.global = {
                authenticated: !! $rootScope.user,
                user: $rootScope.user
            };
        });

    }
]);