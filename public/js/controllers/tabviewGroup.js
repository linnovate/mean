'use strict';

var tabViewGroup = angular.module('tabViewGroup', ['ngRoute']);

tabViewGroup.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/group_message', {
        templateUrl: '/views/group_message_list.html',
        controller: 'GroupMessageController',
        controllerAs: 'messages'
      })
      .when('/group_campaign', {
        templateUrl: '/views/campaign_list.html',
        controller: 'CampaignListController',
        controllerAs: 'campaign'
      })
      .when('/group_member', {
        templateUrl: '/views/member_list.html',
        controller: 'MemberListController',
        controllerAs: 'member'
      })
      .when('/group_info', {
        templateUrl: '/group/renderInfo',
        controller: 'infoController',
        controllerAs: 'account'
      }).
      otherwise({
        redirectTo: '/group_message'
      });
  }]);

tabViewGroup.controller('GroupMessageController', ['$http','$scope',
  function ($http, $scope) {
    var that = this;
    //消除ajax缓存
    $http.get('/group/getGroupMessages?' + Math.round(Math.random()*100)).success(function(data, status) {
      that.group_messages = data;
      that.show = true;
      that.vote = false;
    });

    //应战
    $scope.responseProvoke = function(provoke_message_id) {
         try {
            $http({
                method: 'post',
                url: '/group/responseProvoke',
                data:{
                    provoke_message_id : provoke_message_id
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



tabViewGroup.controller('CampaignListController', ['$http', '$scope',
  function($http, $scope) {
    var that = this;
    $http.get('/group/getCampaigns?' + Math.round(Math.random()*100)).success(function(data, status) {
      that.campaigns = data.data;
      that.show = data.role === 'EMPLOYEE';    //由于还未设置权限,目前普通员工也可以关闭活动  TODO
    });

    //TODO 发起活动或者挑战时搜索应约对象 暂时先放在这里
    $http.get('/search/company').success(function(data, status) {
      that.companies = data;
    });


    $scope.provoke_select = function( uid) {
        that.uid_opposite = uid;
        alert(uid);
    };
    $scope.getUser = function( cid) {
        that.cid_opposite = cid;
        try {
            $http({
                method: 'post',
                url: '/search/user',
                data:{
                    cid : cid
                }
            }).success(function(data, status) {
                that.users = data;
            }).error(function(data, status) {
                alert('数据发生错误！');
            });
        }
        catch(e) {
            console.log(e);
        }
    };

    //约战
    $scope.provoke = function() {
        
         try {
            $http({
                method: 'post',
                url: '/group/provoke',
                data:{
                    provoke_model : 'against',
                    cid_opposite : that.cid_opposite,
                    content : $scope.content,
                    team_b : $scope.team_b,
                    uid_opposite : that.uid_opposite,

                    location: $scope.location,
                    remark: $scope.remark,
                    competition_date: $scope.competition_date,
                    deadline: $scope.deadline,
                    competition_format: $scope.competition_format,
                    number: $scope.number

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

    $scope.getId = function(cid) {
        that.campaign_id = cid;
    };
    $scope.editCampaign = function() {
        try{
            $http({
                method: 'post',
                url: '/group/campaignEdit',
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
                url: '/group/campaignSponsor',
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
                url: '/group/campaignCancel',
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

tabViewGroup.controller('MemberListController', ['$http', function($http) {
    var that = this;
    $http.get('/group/getGroupMembers?' + Math.round(Math.random()*100)).success(function(data, status) {
      that.group_members = data;
      console.log(that.group_members);
    });
}]);

tabViewGroup.controller('infoController', ['$http', '$scope',function($http, $scope) {
    $scope.unEdit = true;
    $scope.buttonStatus = '编辑>';

    var that = this;
    $http.get('/group/info').success(function(data, status) {
      that.group_info = data;
      $scope.name = that.group_info.companyGroup.name != undefined ? that.group_info.companyGroup.name : '无';
      $scope.brief = that.group_info.companyGroup.brief != undefined ? that.group_info.companyGroup.brief : '无';
      $scope.leader_names = that.group_info.companyGroup.leader.username.length > 0 ? that.group_info.companyGroup.leader.username : ['无'];
      $scope.main_forces = that.group_info.entity.main_force != undefined ? that.group_info.entity.main_force : [{'username':'无'}];
      $scope.alternates = that.group_info.entity.alternate != undefined ? that.group_info.entity.alternate : [{'username':'无'}];
      $scope.home_courts = that.group_info.entity.homecourt != undefined ? that.group_info.entity.homecourt : ['无'];
    });

    $scope.editToggle = function() {
        $scope.unEdit = !$scope.unEdit;
        if($scope.unEdit) {
            try{
                $http({
                    method : 'post',
                    url : '/group/saveInfo',
                    data : {
                        'name' : $scope.name,
                        'brief' : $scope.brief
                    }
                }).success(function(data, status) {
                    //TODO:更改对话框
                    if(data.result === 1) {
                        alert('信息修改成功！');
                        window.location.reload();
                    }
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
            $scope.buttonStatus = '编辑>';
        }
        else {
            $scope.buttonStatus = '保存';
        }
  };
}]);
