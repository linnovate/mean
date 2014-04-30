'use strict';

var arenaApp = angular.module('arena', []);

arenaApp.controller('arenaListController', ['$http', '$scope',function ($http, $scope) {
  $scope.robArena = function(id){
    try {
      $http({
        method: 'get',
        url: '/arena/rob/'+id
      }).success(function(data, status) {
        alert(data.msg);
        if(data.result==1){
          window.location.href='/arena/detail/'+id;
        }
        //window.location.reload();
      }).error(function(data, status) {
          alert('数据发生错误！');
      });
    }
    catch(e) {
      console.log(e);
    }
  };
}]);
arenaApp.controller('arenaDetailController', ['$http', '$scope',function ($http, $scope) {
  $scope.challengeArena = function(id){
    try {
      $http({
        method: 'get',
        url: '/arena/challenge/'+id,
      }).success(function(data, status) {
        alert(data.msg);
        if(data.result==1){
          window.location.href='/arena/detail/'+id;
        }
        //window.location.reload();
      }).error(function(data, status) {
          alert('数据发生错误！');
      });
    }
    catch(e) {
      console.log(e);
    }
  };
  $scope.campaign_info = {};
  $scope.campaignDisabled =false;
  $scope.robArena = function(id){
    try {
      $http({
        method: 'get',
        url: '/arena/rob/'+id
      }).success(function(data, status) {
        alert(data.msg);
        if(data.result==1){
          window.location.href='/arena/detail/'+id;
        }
        //window.location.reload();
      }).error(function(data, status) {
          alert('数据发生错误！');
      });
    }
    catch(e) {
      console.log(e);
    }
  };
  $scope.addCampaignInfo = function(id){
    try {
      $scope.campaign_info.competition_date = $('#dtp_input_competition_date').val();
      $scope.campaign_info.deadline = $('#dtp_input_deadline').val();
      $http({
        method: 'post',
        url: '/arena/addCampaignInfo/'+id,
        data:{campaign_info:$scope.campaign_info}
      }).success(function(data, status) {
        alert(data.msg);
        if(data.result==1){
          window.location.href='/arena/detail/'+id;
        }
        //window.location.reload();
      }).error(function(data, status) {
          alert('数据发生错误！');
      });
    }
    catch(e) {
      console.log(e);
    }
  };
}]);
