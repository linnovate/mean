'use strict';

var companyApp = angular.module('company', ['pcselector']);

companyApp.controller('RegisterController', ['$scope', 'PCSelector', 
    function($scope, PCSelector) {
        $scope.pcSelector = new PCSelector.PCSelector();
    }
]);
companyApp.controller('GroupsController',['$scope','$http', function($scope,$http) {
    $http.get('/group/getgroups').success(function(data,status){
        $scope.groups =data;
    }).error(function(data,status){
        alert('组件获取失败！');
    });
    $scope.selected =[];
    $scope.group_next = function(){
        $scope.selected.length = 0;
        angular.forEach($scope.groups, function(value, key){
            if(value.select==='1'){
                $scope.selected.push(value.type);
            }
        });
        try{
            $http({
                method: 'post',
                url: '/company/groupSelect',
                data:{
                    selected : $scope.selected
                }
            }).success(function(data, status) {
                //alert('success');
                // console.log(data);
                alert("选择组件成功！");
                window.location.href="/company/invite";
            }).error(function(data, status) {
                alert("数据发生错误！");
            });
        }
        catch(e){
            console.log(e);
        }
    };
}]);
