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
      alert(_id);
    };
}]);


tabViewCompany.controller('GroupMessageController', ['$http',
  function($http) {
    var that = this;
    $http.get('/company/getCompanyMessages').success(function(data, status) {
      that.group_messages = data;
    });
}]);

tabViewCompany.controller('CampaignListController', ['$http','$scope',
  function($http,$scope) {
    var that = this;
    $http.get('/company/getCampaigns').success(function(data, status) {
      that.campaigns = data;
    });

    $scope.join = function(campaign_id) {
      alert(campaign_id);
        try {
            $http({
                method: 'post',
                url: '/users/joinCampaign',
                data:{
                    campaign_id : campaign_id
                }
            }).success(function(data, status) {
                alert("成功加入该活动!");
            }).error(function(data, status) {
                alert("数据发生错误！");
            });
        }
        catch(e) {
            console.log(e);
        }
    };

    $scope.quit = function(campaign_id) {
        try {
            $http({
                method: 'post',
                url: '/users/quitCampaign',
                data:{
                    campaign_id : campaign_id
                }
            }).success(function(data, status) {
                alert("您已退出该活动!");
            }).error(function(data, status) {
                alert("数据发生错误！");
            });
        }
        catch(e) {
            console.log(e);
        }
    };
}]);

