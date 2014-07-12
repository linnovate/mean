'use strict';

angular.module('mean.slack').controller('SlackController', ['$scope', 'Global', 'Slack',
    function($scope, Global, Slack) {
        $scope.global = Global;
        $scope.package = {
            name: 'slack'
        };
    }
]);
