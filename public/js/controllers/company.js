'use strict';

var companyApp = angular.module('company', ['pcselector']);

//企业提交申请信息,这里也要改成ajax的
companyApp.controller('RegisterController', ['$scope', 'PCSelector', 
    function($scope, PCSelector) {
        $scope.pcSelector = new PCSelector.PCSelector();
    }
]);


var page = 0;

//控制局部页面跳转
companyApp.controller('ConfirmController', ['$scope', '$http', function($scope, $http) {
    $scope.page_generator = function(){
        switch(page) {
            case 0:
                return '/company/create_company_account';
            case 1:
                return '/company/select';
            case 2:
                return '/company/invite';
            default:
                return '/';
        }
    };
}]);


//企业激活后注册企业用户名和密码
companyApp.controller('DetailController', ['$scope', '$http', function($scope, $http) {
    $scope.create_detail = function(){
        try{
            $http({
                method: 'post',
                url: '/company/createDetail',
                data:{
                    username : $scope.username,
                    password : $scope.password
                }
            }).success(function(data, status) {

                page = 1;
                page_generator();

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
        $scope.groups = data;
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

                page = 2;
                page_generator();

            }).error(function(data, status) {
                alert("数据发生错误！");
            });
        }
        catch(e){
            console.log(e);
        }
    };
}]);

