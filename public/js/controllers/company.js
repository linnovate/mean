'use strict';

var companyApp = angular.module('company', ['pcselector']);

//企业提交申请信息
companyApp.controller('RegisterController', ['$scope', 'PCSelector', 
    function($scope, PCSelector) {
        $scope.pcSelector = new PCSelector.PCSelector();
    }
]);

//企业激活后注册企业用户名和密码
companyApp.controller('DetailController', ['$scope', '$http', function($scope, $http) {
    $scope.create_detail = function(){
        alert('dsds');
        try{
            $http({
                method: 'post',
                url: '/company/createDetail',
                data:{
                    username : $scope.username,
                    password : $scope.password
                }
            }).success(function(data, status) {

                //这里必须是局部刷新!
                window.location.href="/company/select";

            }).error(function(data, status) {
                alert("数据发生错误！");
            });
        }
        catch(e){
            console.log(e);
        }
    };
}]);

//企业选择组件
companyApp.controller('GroupsController',['$scope','$http', function($scope,$http) {
    $http.get('/group/getgroups').success(function(data,status){
        $scope.groups =data;
        console.log($scope.groups);
    }).error(function(data,status){
        alert('组件获取失败！');
    });
    $scope.item =[];
    $scope.group_next = function(){
        $scope.item.length = 0;
        angular.forEach($scope.groups, function(value, key){
            if(value.select==='1'){
                $scope.item.push(value.id);
            }
        });
        try{
            $http({
                method: 'post',
                url: '/company/groupSelect',
                data:{
                    item : $scope.item
                }
            }).success(function(data, status) {
                //alert('success');
                // console.log(data);
                alert("选择组件成功！");

                //这里必须是局部刷新!
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
