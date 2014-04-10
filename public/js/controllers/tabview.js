'use strict';

var tabView = angular.module('tabView', ['ngRoute']);

tabView.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/group_message', {
        templateUrl: '/views/group_message_list.html',
        controller: 'GroupMessageController',
        controllerAs: 'messages'
      });
  }]);

tabView.controller('GroupMessageController', ['$http',
  function($http){
    var that = this;
    $http.get('/users/getGroupMessages').success(function(data, status) {
      that.group_messages = data;
    });
}]);

