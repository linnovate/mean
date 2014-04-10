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

   //个人信息表单
userApp.controller('AccountFormController',['$scope','$http',function($scope, $http) {
    $http.get('/users/getAccount').success(function(data,status){
        if(data.result==1){
            $scope.user = data.data;
        }
        else{
             console.log(data.msg);
        }
        console.log($scope.user);
    }).error(function(data,status) {
        //TODO:更改对话框
        console.log('个人账号信息获取失败！');
    });
    $scope.baseUnEdit = true;
    $scope.baseButtonStatus = "编辑>";
    $scope.linkUnEdit = true;
    $scope.linkButtonStatus = "编辑>"
    $scope.baseEditToggle = function() {
        $scope.baseUnEdit = !$scope.baseUnEdit;
        if($scope.baseUnEdit) {
            try{
                var _info ={
                    email: $scope.user.email,
                    nickname: $scope.user.nickname,
                    realname: $scope.user.realname,
                    position: $scope.user.position,
                    sex: $scope.user.sex,
                    birthday: $scope.user.birthday,
                    bloodType: $scope.user.bloodType,
                    introduce: $scope.user.introduce,
                };
                $http({
                    method : 'post',
                    url : '/users/saveAccount',
                    data : {
                        user : _info
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
            $scope.baseButtonStatus = "编辑>";
        }
        else {
            $scope.baseButtonStatus = "保存";
        }
    };
    $scope.linkEditToggle = function() {
        $scope.linkUnEdit = !$scope.linkUnEdit;
        if($scope.linkUnEdit) {
            try{
                var _info ={
                    phone: $scope.user.phone,
                    email: $scope.user.email,
                    qq: $scope.user.qq
                };
                $http({
                    method : 'post',
                    url : '/users/saveAccount',
                    data : {
                        user : _info
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
            $scope.linkButtonStatus = "编辑>";
        }
        else {
            $scope.linkButtonStatus = "保存";
        }
    };
}]);
