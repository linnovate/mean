'use strict';

var tabViewGroup = angular.module('tabViewGroup', ['ngRoute']);

tabViewGroup.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/group_message', {
        templateUrl: '/views/group_message_list.html',
        controller: 'GroupMessageController',
        controllerAs: 'messages'
      })
      .when('/group_campaign', {
        templateUrl: '/views/campaign_list.html',
        controller: 'CampaignListController',
        controllerAs: 'campaign'
      }).
      otherwise({
        redirectTo: '/group_message'
      });
  }]);

tabViewGroup.controller('GroupMessageController', ['$http',
  function($http) {
    var that = this;
    $http.get('/group/getGroupMessages?' + Math.round(Math.random()*100)).success(function(data, status) {
      that.group_messages = data;
    });
}]);

tabViewGroup.controller('CampaignListController', ['$http', '$scope',
  function($http, $scope) {
    var that = this;
    $http.get('/group/getCampaigns?' + Math.round(Math.random()*100)).success(function(data, status) {
      that.campaigns = data;
    });

    $scope.join = function(campaign_id) {
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

    $scope.sponsor = function() {
        try{
            $http({
                method: 'post',
                url: '/group/campaignSponsor',
                data:{
                    content : $scope.content,
                    start_time : $scope.start_time,
                    end_time : $scope.end_time
                }
            }).success(function(data, status) {
                //发布活动后跳转到显示活动列表页面
                window.location.reload();

            }).error(function(data, status) {
                //TODO:更改对话框
                alert("数据发生错误！");
            });
        }
        catch(e){
            console.log(e);
        }
    };
}]);
