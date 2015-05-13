'use strict';

angular.module('mean.admin').controller('AdminController', ['$scope', 'Global', 'Menus', '$rootScope', 'MeanUser',
    function($scope, Global, Menus, $rootScope, MeanUser) {
        $scope.global = Global;
        $scope.menus = {};
        $scope.overIcon = false;
        $scope.user = MeanUser;
        var icons = 'admin/assets/img/icons/';
        
        // Default hard coded menu items for main menu
        var defaultAdminMenu = [{
            'roles': ['admin'],
            'title': 'MODULES',
            'link': 'modules',
            'icon': icons + 'modules.png'
        }, {
            'roles': ['admin'],
            'title': 'THEMES',
            'link': 'themes',
            'icon': icons + 'themes.png'
        }, {
            'roles': ['admin'],
            'title': 'SETTINGS',
            'link': 'settings',
            'icon': icons + 'settings.png'
        }, {
            'roles': ['admin'],
            'title': 'USERS',
            'link': 'users',
            'icon': icons + 'users.png'
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
