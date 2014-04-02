'use strict';

angular.module('company')
  .controller('RegisterController', ['$scope', 'PCSelector', function($scope, PCSelector) {
    $scope.pcSelector = new PCSelector.PCSelector();
  }]);
angular.module('company')
    .controller('groupsController',['$scope','$http', function($scope,$http) {
        $scope.groups = [
            {id:1,name:'足球1',select:'0'},
            {id:2,name:'篮球1',select:'1'},
            {id:3,name:'跑步1',select:'0'},
            {id:4,name:'读书1',select:'1'},
            {id:5,name:'足球2',select:'0'},
            {id:6,name:'篮球2',select:'1'},
            {id:7,name:'跑步2',select:'0'},
            {id:8,name:'读书2',select:'1'},
            {id:9,name:'足球3',select:'0'},
            {id:10,name:'篮球3',select:'1'},
            {id:11,name:'跑步3',select:'0'},
            {id:12,name:'读书3',select:'1'}
        ];
        $scope.selected =[];
        $scope.group_next = function(){
            $scope.selected.length = 0;
            angular.forEach($scope.groups, function(value, key){
                if(value.select==='1'){
                    $scope.selected.push(value.id);
                }
            });
            try{
                $http({
                    method: 'post',
                    url: '/company/groupSelect',
                    data:{
                        selected : $scope.selected
                    }
                }).success(function(data, status) {
                    //alert('success');
                    // console.log(data);
                    alert("选择组件成功！");
                    window.location.href="/company/invite";
                }).error(function(data, status) {
                    alert("数据发生错误！");
                });
            }
            catch(e){
                console.log(e);
            }
        };
    }]);
