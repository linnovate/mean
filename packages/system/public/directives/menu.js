'use strict';
/*global jQuery:false */

angular.module('mean.system').
directive('meanMenuitem', ['$compile', '$state', function ($compile, $state) {
  function add_itm($ul, itm) {
    var $li = $('<li>');
    var $a = $('<a>').attr($state.get(itm.link) ? 'ui-sref' : 'href', itm.link).text(itm.title);
    if (itm.submenus.length) {
      $li.addClass('dropdown-submenu');
      $li.append($a);
      var $submenu_ul = $('<ul>').addClass('dropdown-menu');
      itm.submenus.forEach(add_itm.bind(null, $submenu_ul));
      $li.append($submenu_ul);
    }else{
      $li.append($a);
    }
    $ul.append($li);
  }


  function monitor ($scope, $el, attrs, new_val, old_val) {
    $el.empty();
    if (!$scope.items) return;
    angular.forEach ($scope.items, function (itm) {
      if (!itm.title) return;
      var $li = $('<li>');
      var $a = $('<a>').text(itm.title);
      if (itm.link) {
        $a.attr($state.get(itm.link) ? 'ui-sref' : 'href', itm.link);
      }

      if (itm.submenus.length) {
        $a.attr({'data-toggle':'dropdown'}).addClass('dropdown-toggle').append($('<b>').addClass('caret'));
        $li.append($a);
        var $ul = $('<ul>').addClass('dropdown-menu');
        itm.submenus.forEach(add_itm.bind(null, $ul));
        $li.append($ul);
      }else{
        $li.append($a);
      }
      $el.append($li);
      $compile($el.contents())($scope);
    });
  }

  var $ = jQuery;
  return{
    controller: function ($scope) {
    },
    scope: {
      items:'='
    },
    restrict:'E',
    replace:true,
    template: '<ul class="navbar-nav nav" role="menu"></ul>',
    link:function ($scope, $el, attrs) {
      $scope.$watch ('items', monitor.bind(null, $scope, $el, attrs));
    }
  };
}]);
