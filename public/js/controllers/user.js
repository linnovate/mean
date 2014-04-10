'use strict';

var userApp = angular.module('user', []);

//员工注册后在公司组件列表里选择组件
userApp.controller('GroupsController', ['$scope','$http', function($scope, $http) {
    $http.get('/group/getCompanyGroups').success(function(data, status) {
        $scope.groups = data;
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
                $scope.selected.push(value.gid);
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
                alert("选择组件成功！");
                window.location.href = "/users/finishRegister";
            }).error(function(data, status) {
                alert("数据发生错误！");
            });
        }
        catch(e) {
            console.log(e);
        }
    };
}]);


userApp.controller('CampaignController', ['$scope','$http', function($scope, $http) {
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
});

userApp.controller('TabController', ['$scope', '$http', function($scope, $http) {
    
}]);
