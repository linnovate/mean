//组件列表控制器
'use strict';


var groupApp = angular.module('group', []);


//小组发布活动
groupApp.controller('GroupCampaignSponsorController', ['$http', function($http) {
    var _this = this;
    this.sponsor = function() {
        try{
            $http({
                method: 'post',
                url: '/group/campaignSponsor',
                data:{
                    content : _this.content,
                    start_time : _this.start_time,
                    end_time : _this.end_time
                }
            }).success(function(data, status) {
                //发布活动后跳转到显示活动列表页面
                window.location.href = '/group/campaign';

            }).error(function(data, status) {
                //TODO:更改对话框
                alert("数据发生错误！");
            });
        }
        catch(e){
            console.log(e);
        }
    };

