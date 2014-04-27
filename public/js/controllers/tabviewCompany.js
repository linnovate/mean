'use strict';

var tabViewCompany = angular.module('tabViewCompany', ['ngRoute']);


tabViewCompany.directive('match', function($parse) {
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
tabViewCompany.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/company_message', {
        templateUrl: '/views/group_message_list.html',
        controller: 'GroupMessageController',
        controllerAs: 'messages'
      })
      .when('/company_group', {
        templateUrl: '/views/group_list.html',
        controller: 'GroupListController',
        controllerAs: 'group'
      })
      .when('/company_campaign', {
        templateUrl: '/views/campaign_list.html',
        controller: 'CampaignListController',
        controllerAs: 'campaign'
      })
      .when('/company_info', {
        templateUrl: '/company/Info',
        controller: 'AccountFormController',
        controllerAs: 'account'
      })
      .when('/changePassword', {
        templateUrl: '/views/change_password.html',
        controller: 'PasswordFormController',
        controllerAs: 'password'
      }).
      otherwise({
        redirectTo: '/company_message'
      });
  }]);


tabViewCompany.controller('GroupListController', ['$http', '$scope',
 function ($http, $scope) {

    var that = this;
    $http.get('/group/getCompanyGroups').success(function(data, status) {
      that.group_lists = data.group;
      that.cid = data.cid;
    });

    $scope.setGroupId = function (gid) {
        that.gid = gid;
        try{
            $http({
                method: 'post',
                url: '/search/user',
                data:{
                    cid: that.cid,
                    gid: that.gid
                }
            }).success(function(data, status) {
                //发布活动后跳转到显示活动列表页面
                that.users = data;
            }).error(function(data, status) {
                //TODO:更改对话框
                alert('数据发生错误！');
            });
        }
        catch(e){
            console.log(e);
        }
    };
    $scope.appointLeader = function (uid) {
      try{
            $http({
                method: 'post',
                url: '/company/appointLeader',
                data:{
                    cid: that.cid,
                    gid: that.gid,
                    uid: uid
                }
            }).success(function(data, status) {
                //发布活动后跳转到显示活动列表页面
                window.location.reload();
            }).error(function(data, status) {
                //TODO:更改对话框
                alert('数据发生错误！');
            });
        }
        catch(e){
            console.log(e);
        }
    };
}]);


tabViewCompany.controller('GroupMessageController', ['$http',
  function($http) {
    var that = this;
    $http.get('/company/getCompanyMessages').success(function(data, status) {
      that.group_messages = data;
      that.show = false;
      that.vote = false;
    });
}]);

tabViewCompany.controller('CampaignListController', ['$http','$scope',
  function($http,$scope) {
    var that = this;
    $http.get('/company/getCampaigns').success(function(data, status) {
      that.campaigns = data.data;
      that.show = data.role === 'EMPLOYEE';  //由于还未设置权限,目前普通员工也可以关闭活动  TODO
    });


    $scope.getId = function(cid) {
        that.campaign_id = cid;
    };
    $scope.editCampaign = function() {
        try{
            $http({
                method: 'post',
                url: '/company/campaignEdit',
                data:{
                    campaign_id : that.campaign_id,
                    content : $scope.content,
                    start_time : $scope.start_time,
                    end_time : $scope.end_time
                }
            }).success(function(data, status) {
                //发布活动后跳转到显示活动列表页面
                window.location.reload();

            }).error(function(data, status) {
                //TODO:更改对话框
                alert('数据发生错误！');
            });
        }
        catch(e){
            console.log(e);
        }
    };

    $scope.join = function(campaign_id) {
      alert(campaign_id);
        try {
            $http({
                method: 'post',
                url: '/users/joinCampaign',
                data:{
                    campaign_id : campaign_id
                }
            }).success(function(data, status) {
                window.location.reload();
                alert('成功加入该活动!');
            }).error(function(data, status) {
                alert('数据发生错误！');
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
                window.location.reload();
                alert('您已退出该活动!');
            }).error(function(data, status) {
                alert('数据发生错误！');
            });
        }
        catch(e) {
            console.log(e);
        }
    };

    $scope.sponsor = function() {
        try{
            $http({
                method: 'post',
                url: '/company/campaignSponsor',
                data:{
                    content : $scope.content,
                    start_time : $scope.start_time,
                    end_time : $scope.end_time
                }
            }).success(function(data, status) {
                //发布活动后跳转到显示活动列表页面
                window.location.reload();

            }).error(function(data, status) {
                //TODO:更改对话框
                alert('数据发生错误！');
            });
        }
        catch(e){
            console.log(e);
        }
    };

    $scope.cancel = function (_id) {
        try {
            $http({
                method: 'post',
                url: '/company/campaignCancel',
                data:{
                    campaign_id : _id
                }
            }).success(function(data, status) {
                window.location.reload();
            }).error(function(data, status) {
                alert('数据发生错误！');
            });
        }
        catch(e) {
            console.log(e);
        }
    };
}]);
tabViewCompany.controller('AccountFormController',['$scope','$http',function($scope, $http) {
    $http.get('/company/getAccount').success(function(data,status){
        $scope.company = data.company;
        $scope.info = data.info;
    }).error(function(data,status) {
        //TODO:更改对话框
        alert('企业账号信息获取失败！');
    });
    $scope.accountUnEdit = true;
    $scope.accountButtonStatus = '编辑>';
    $scope.infoUnEdit = true;
    $scope.infoButtonStatus = '编辑>';
    $scope.accountEditToggle = function() {
        $scope.accountUnEdit = !$scope.accountUnEdit;
        if($scope.accountUnEdit) {
            try{
                $http({
                    method : 'post',
                    url : '/company/saveAccount',
                    data : {
                        company : $scope.company
                    }
                }).success(function(data, status) {
                    console.log(data);
                    //TODO:更改对话框
                    if(data.result === 1)
                        alert(data.msg);
                    else
                        alert(data.msg);
                }).error(function(data, status) {
                    //TODO:更改对话框
                    alert('数据发生错误！');
                });
            }
            catch(e) {
                console.log(e);
            }
            $scope.accountButtonStatus = '编辑>';
        }
        else {
            $scope.accountButtonStatus = '保存';
        }
    };
    $scope.infoEditToggle = function() {
        $scope.infoUnEdit = !$scope.infoUnEdit;
        if($scope.infoUnEdit) {
            try{
                $http({
                    method : 'post',
                    url : '/company/saveAccount',
                    data : {
                        info : $scope.info
                    }
                }).success(function(data, status) {
                    console.log(data);
                    //TODO:更改对话框
                    if(data.result === 1)
                        alert(data.msg);
                    else
                        alert(data.msg);
                }).error(function(data, status) {
                    //TODO:更改对话框
                    alert('数据发生错误！');
                });
            }
            catch(e) {
                console.log(e);
            }
            $scope.infoButtonStatus = '编辑>';
        }
        else {
            $scope.infoButtonStatus = '保存';
        }
    };
}]);
tabViewCompany.controller('PasswordFormController', ['$http', function($http) {
    var that = this;
    this.nowpassword = '';
    this.newpassword = '';
    this.confirmpassword = '';
    this.change_password = function(){
        $http({
            method : 'post',
            url : '/company/changePassword',
            data : {
                'nowpassword' : that.nowpassword,
                'newpassword' : that.newpassword
            }
        }).success(function(data, status) {
            console.log(data);
            //TODO:更改对话框
            if(data.result === 1){
                alert(data.msg);
                window.location.href = '#/company_info';
            }
            else
                alert(data.msg);
        }).error(function(data, status) {
            //TODO:更改对话框
            alert('数据发生错误！');
        });
    };
}]);
