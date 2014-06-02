'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', '$state', 'Global', 'Menus',
    function($scope, $rootScope, $state, Global, Menus) {
        $scope.global = Global;
        $scope.menus = {};
        $scope.$state = $state;
        
        // Default hard coded menu items for main menu
        var defaultMainMenu = [];

        // Query menus added by modules. Only returns menus that user is allowed to see.
        function queryMenu(name, defaultMenu) {
            Menus.query(name,defaultMenu).then(
                function (result) {
                   $scope.menus[name] = result.data; 
                },
                function (reason) {
                   throw new Error(reason);
                }
            );
        }

        // Query server for menus and check permissions
        queryMenu('main', defaultMainMenu);

        $scope.isCollapsed = false;

        $rootScope.$on('loggedin', function() {

            queryMenu('main', defaultMainMenu);

            $scope.global = {
                authenticated: !! $rootScope.user,
                user: $rootScope.user
            };
        });

    }
]);
