'use strict';

var tabViewGroup = angular.module('tabViewGroup', ['ngRoute']);

tabViewGroup.run(['$rootScope', function( $rootScope) {
    $rootScope.addactive = function(value) {
        $rootScope.nowTab = value;
    };
}]);
tabViewGroup.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider,$rootScope) {
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
        controllerAs: 'account',
      }).
      otherwise({
        redirectTo: '/group_message'
      });
  }]);

tabViewGroup.controller('GroupMessageController', ['$http','$scope',
  function ($http, $scope) {
    //消除ajax缓存
    $http.get('/group/getGroupMessages?' + Math.round(Math.random()*100)).success(function(data, status) {
      $scope.group_messages = data;
      $scope.show = true;
      $scope.voteFlag = true;
    });


    $scope.vote = function(provoke_message_id, status) {
         try {
            $http({
                method: 'post',
                url: '/users/vote',
                data:{
                    provoke_message_id : provoke_message_id,
                    aOr : status
                }
            }).success(function(data, status) {
                if(data.msg != undefined && data.msg != null) {
                    alert(data.msg);
                }
                window.location.reload();
            }).error(function(data, status) {
                alert('数据发生错误！');
            });
        }
        catch(e) {
            console.log(e);
        }
    };

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
    //消除ajax缓存
    $http.get('/group/getCampaigns?' + Math.round(Math.random()*100)).success(function(data, status) {
      $scope.campaigns = data.data;
      $scope.show = data.permission;    //只有改组的组长才可以操作活动(关闭、编辑等)
    });

    //TODO 发起活动或者挑战时搜索应约对象 暂时先放在这里
    $http.get('/search/company').success(function(data, status) {
      $scope.companies = data;
    });

    $scope.judge = function() {
        if($scope.content!="") {
            $scope.campaign_ok = false;
        } else {
            $scope.campaign_ok = true;
        }
    };

    $scope.campaign_ok = false;

    var campaign_start_value,provoke_start_value;
    var first=false;

    $('#campaign_start')
    .datetimepicker()
    .on('changeDate', function(ev){
        campaign_start_value = ev.date.valueOf();
    });

    $('#campaign_end')
    .datetimepicker()
    .on('changeDate', function(ev){
        if(ev.date.valueOf() <= campaign_start_value) {
            if(!first){
                alert('结束时间不能早于开始时间!');
                first = true;
                $scope.campaign_ok = true;
            }
        } else {
            $scope.campaign_ok = false;
        }
    });

    $scope.provoke_select = function( tname) {
        $scope.team_opposite = tname;
        alert($scope.team_opposite);
    };
    $scope.getTeam = function (cid) {
        $scope.cid_opposite = cid;
        try {
            $http({
                method: 'post',
                url: '/search/team',
                data:{
                    cid : cid
                }
            }).success(function(data, status) {
                $scope.teams = data;
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
                    cid_opposite : $scope.cid_opposite,
                    content : $scope.content,
                    team_opposite : $scope.team_opposite,

                    location: $scope.location,
                    remark: $scope.remark,
                    competition_date: document.getElementById('dtp_input_competition_date').value,
                    deadline: document.getElementById('dtp_input_deadline').value,
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
        $scope.campaign_id = cid;
    };
    $scope.editCampaign = function() {
        try{
            $http({
                method: 'post',
                url: '/group/campaignEdit',
                data:{
                    campaign_id : $scope.campaign_id,
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
                    location: $scope.location,
                    content : $scope.content,
                    start_time : document.getElementById('dtp_input_start_time').value,
                    end_time : document.getElementById('dtp_input_end_time').value
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

tabViewGroup.controller('MemberListController', ['$http','$scope', function($http,$scope) {
    $http.get('/group/getGroupMembers?' + Math.round(Math.random()*100)).success(function(data, status) {
      $scope.group_members = data;
    });
}]);

tabViewGroup.controller('infoController', ['$http', '$scope',function($http, $scope) {
    $scope.unEdit = true;
    $scope.buttonStatus = '编辑>';
    $http.get('/group/info').success(function(data, status) {
        $scope.companyname = data.companyname;
        $scope.create_time = data.entity.create_date ? data.entity.create_date :'';
        $scope.name = data.companyGroup.name ? data.companyGroup.name : '';
        $scope.brief = data.companyGroup.brief ? data.companyGroup.brief : '';
        $scope.leaders = data.companyGroup.leader.length > 0 ? data.companyGroup.leader : '';
        $scope.main_forces = data.entity.main_force.length > 0 ? data.entity.main_force : '';
        $scope.alternates = data.entity.alternate.length > 0 ? data.entity.alternate : '';
        $scope.home_court_1 = data.entity.home_court[0] ? data.entity.home_court[0] : '';
        $scope.home_court_2 = data.entity.home_court[1] ? data.entity.home_court[1] : '';
        $scope.family = data.entity.family;
        $scope.members = data.companyGroup.member;
        //TOTO:测试数据
        /*
        var _member = [{'username':'阿飞','photo':'/img/user/photo/default.png'},
                        {'username':'大天','photo':'/img/user/photo/default.png'},
                        {'username':'小良','photo':'/img/user/photo/default.png'},
                        {'username':'lee','photo':'/img/user/photo/default.png'},
                        {'username':'阿飞','photo':'/img/user/photo/default.png'},
                        {'username':'大天','photo':'/img/user/photo/default.png'},
                        {'username':'小良','photo':'/img/user/photo/default.png'},
                        {'username':'lee','photo':'/img/user/photo/default.png'},
                        {'username':'阿飞','photo':'/img/user/photo/default.png'},
                        {'username':'大天','photo':'/img/user/photo/default.png'},
                        {'username':'小良','photo':'/img/user/photo/default.png'},
                        {'username':'lee','photo':'/img/user/photo/default.png'}];
        var _leaders = [{'username':'阿飞','photo':'/img/user/photo/default.png'},
                        {'username':'大天','photo':'/img/user/photo/default.png'}];
        
        $scope.leaders = _leaders;
        $scope.main_forces = _member;
        */
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
                        'brief' : $scope.brief,
                        'homecourt': [$scope.home_court_1,$scope.home_court_2]
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
