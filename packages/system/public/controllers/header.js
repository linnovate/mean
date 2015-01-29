'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Menus', 'MeanUser',
  function($scope, $rootScope, Menus, MeanUser) {
    
    var vm = this;

    vm.menus = {};
    vm.hdrvars = {};

    // Default hard coded menu items for main menu
    var defaultMainMenu = [];

    // Query menus added by modules. Only returns menus that user is allowed to see.
    function queryMenu(name, defaultMenu) {

      Menus.query({
        name: name,
        defaultMenu: defaultMenu
      }, function(menu) {
        vm.menus[name] = menu;
      });
    }

    // Query server for menus and check permissions
    queryMenu('main', defaultMainMenu);

    $scope.isCollapsed = false;

    $rootScope.$on('loggedin', function() {

      queryMenu('main', defaultMainMenu);

      vm.hdrvars = {
        authenticated: !! MeanUser.user,
        user: MeanUser.user, 
        isAdmin: MeanUser.isAdmin
      };
    });

  }
]);
