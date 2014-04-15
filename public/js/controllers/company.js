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
        .otherwise({ redirectTo: '/' });

}]);

companyApp.directive('match', function($parse) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(function() {
        return $parse(attrs.match)(scope) === ctrl.$modelValue;
      }, function(currentValue) {
        ctrl.$setValidity('mismatch', currentValue);
      });
    }
  };
});


companyApp.controller('AppointLeaderController', ['$scope', '$http', function($scope, $http) {
    $scope.appointLeader = function (gid) {
        alert(gid);
    }
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
                window.location.href = '#/groupSelect';

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
companyApp.controller('GroupsController',['$http',function($http) {
    var _this = this;
    $http.get('/group/getgroups').success(function(data,status){
        _this.groups = data;
    }).error(function(data,status) {
        //TODO:更改对话框
        alert('组件获取失败！');
    });
    this.selected_groups =[];
    this.group_next = function() {
        _this.selected_groups.length = 0;
        angular.forEach(_this.groups, function(value, key) {
            if(value.select === '1') {
                _this.selected_groups.push({
                    'gid': parseInt(value.id),
                    'group_type': value.type
                });
            }
        });
        try{
            $http({
                method : 'post',
                url : '/company/groupSelect',
                data : {
                    'selected_groups' : _this.selected_groups
                }
            }).success(function(data, status) {
                //TODO:更改对话框
                alert("选择组件成功！");
                window.location.href='#/invite';

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

