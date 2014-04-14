'use strict';

var tabViewCompany = angular.module('tabViewCompany', ['ngRoute']);

tabViewCompany.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/company_message', {
        templateUrl: '/views/group_message_list.html',
        controller: 'GroupMessageController',
        controllerAs: 'messages'
      })
      .when('/company_group', {
        templateUrl: '/views/group_list.html',
        controller: 'GroupListController',
        controllerAs: 'group'
      })
      .when('/company_campaign', {
        templateUrl: '/views/campaign_list.html',
        controller: 'CampaignListController',
        controllerAs: 'campaign'
      }).
      otherwise({
        redirectTo: '/company_message'
      });
  }]);


tabViewCompany.controller('GroupListController', ['$http', '$scope',
 function ($http, $scope) {
    var that = this;
    $http.get('/group/getCompanyGroups').success(function(data, status) {
      that.group_lists = data;
    });

    $scope.appointLeader = function (_id) {
      //根据小组id任命组长,待定
    };
}]);


tabViewCompany.controller('GroupMessageController', ['$http',
  function($http) {
    var that = this;
    $http.get('/company/getCompanyMessages').success(function(data, status) {
      that.group_messages = data;
    });
}]);

tabViewCompany.controller('CampaignListController', ['$http',
  function($http) {
    var that = this;
    $http.get('/company/getCampaigns').success(function(data, status) {
      that.campaigns = data;
    });
}]);

