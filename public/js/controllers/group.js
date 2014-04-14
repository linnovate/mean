//组件列表控制器
'use strict';


var groupApp = angular.module('group', []);

//小组发布活动
groupApp.controller('GroupCampaignSponsorController', ['$scope','$http', function ($scope, $http) {
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
                window.location.href = '/group/home';

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

//小组信息表单
groupApp.controller('InfoFormController',['$scope','$http',function ($scope, $http) {
  $scope.unEdit = true;
  $scope.buttonStatus = "编辑>";
  $scope.editToggle = function() {
      $scope.unEdit = !$scope.unEdit;
      console.log($scope.companyGroup);
      if($scope.unEdit) {
          try{
              $http({
                  method : 'post',
                  url : '/group/saveInfo',
                  data : {
                      companyGroup : $scope.companyGroup
                  }
              }).success(function(data, status) {
                  console.log(data);
                  //TODO:更改对话框
                  if(data.result === 1)
                      alert("信息修改成功！");
                  else
                      alert(data.msg);
              }).error(function(data, status) {
                  //TODO:更改对话框
                  alert("数据发生错误！");
              });
          }
          catch(e) {
              console.log(e);
          }
          $scope.buttonStatus = "编辑>";
      }
      else {
          $scope.buttonStatus = "保存";
      }
  };
}]);


