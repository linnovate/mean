'use strict';

var userApp = angular.module('user', []);

userApp.directive('match', function($parse) {
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
//员工注册后在公司组件列表里选择组件
userApp.controller('GroupsController', ['$scope','$http', function($scope, $http) {
    $http.get('/group/getCompanyGroups').success(function(data, status) {
        $scope.groups = data.group;
        for(var i = 0, length = $scope.groups.length; i < length; i++) {
            $scope.groups[i].select = '0';
        }
    }).error(function(data,status) {
        alert('组件获取失败');
    });
    $scope.selected = [];
    $scope.group_next = function() {
        $scope.selected.length = 0;
        angular.forEach($scope.groups, function(value, key) {
            if(value.select === '1') {
                $scope.selected.push({
                    'gid': value.gid,
                    'group_type': value.group_type,
                    'entity_type': value.entity_type,
                    'leader' : false
                });
            }
        });
        try {
            $http({
                method: 'post',
                url: '/users/dealSelectGroup',
                data:{
                    selected : $scope.selected
                }
            }).success(function(data, status) {
                alert('选择组件成功！');
                window.location.href = "/users/finishRegister";
            }).error(function(data, status) {
                alert('数据发生错误！');
            });
        }
        catch(e) {
            console.log(e);
        }
    };
}]);


