'use strict';

var companyApp = angular.module('company', ['pcselector','ngRoute']);

//路由管理
companyApp.config(['$routeProvider',function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl:'/company/create_company_account',
            controller: 'DetailController',
            controllerAs: 'detail'
        })
        .when('/groupSelect',{
            templateUrl:'/company/select',
            controller: 'GroupsController',
            controllerAs: 'groupModel'
        })
        .when('/invite',{templateUrl:'/company/invite'})
        .otherwise({ redirectTo: '/company/create_company_account' });

}]);
//企业提交申请信息,这里也要改成ajax的
companyApp.controller('RegisterController', ['$scope', 'PCSelector', 
    function($scope, PCSelector) {
        $scope.pcSelector = new PCSelector.PCSelector();
    }
]);

//企业激活后注册企业用户名和密码
companyApp.controller('DetailController', ['$http', function($http) {
    var _this = this;
    this.create_detail = function() {
        try{
            $http({
                method: 'post',
                url: '/company/createDetail',
                data:{
                    username : _this.username,
                    password : _this.password
                }
            }).success(function(data, status) {

                window.location.href ='#/groupSelect';

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

//企业选择组件
companyApp.controller('GroupsController',['$http', function($http) {
    var _this = this;
    $http.get('/group/getgroups').success(function(data,status){
        _this.groups = data;
        console.log(_this.groups);
    }).error(function(data,status) {
        //TODO:更改对话框
        alert('组件获取失败！');
    });
    this.gid =[];
    this.group_next = function() {
        _this.gid.length = 0;
        angular.forEach(_this.groups, function(value, key) {
            if(value.select === '1') {
                _this.gid.push(value.id);
            }
        });
        try{
            $http({
                method : 'post',
                url : '/company/groupSelect',
                data : {
                    gid : _this.gid
                }
            }).success(function(data, status) {
                //TODO:更改对话框
                alert("选择组件成功！" + _this.gid);
                window.location.href ='#/invite';

            }).error(function(data, status) {
                //TODO:更改对话框
                alert("数据发生错误！");
            });
        }
        catch(e) {
            console.log(e);
        }
    };
}]);
