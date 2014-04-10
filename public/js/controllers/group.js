//组件列表控制器
'use strict';


var groupApp = angular.module('group', []);
try{
//小组信息表单
groupApp.controller('InfoFormController',['$scope','$http',function($scope, $http) {
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
}
catch(e){
  console.log(e);
}