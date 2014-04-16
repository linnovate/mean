'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Menus', 'Global',
    function($scope, Menus, Global) {
        $scope.global = Global;
        $scope.menus = {};

        // Default hard coded menu items for main menu
        var defaultMainMenu = [{
            'roles': ['authenticated'],
            'title': 'Articles',
            'link': 'all articles'
        }, {
            'roles': ['authenticated'],
            'title': 'Create New Article',
            'link': 'create article'
        }];

        // Query menus added by modules. Only returns menus that user is allowed to see.
        function queryMenu(name, defaultMenu) {

            Menus.query({
                name: name,
                defaultMenu: defaultMenu
            }, function(menu) {
                $scope.menus[name] = menu;
            });
        };

        // Query server for menus and check permissions
        queryMenu('main', defaultMainMenu);

        $scope.isCollapsed = false;

        $scope.$on('userChanged', function() {
            queryMenu('main', defaultMainMenu);
        });
    }
]);