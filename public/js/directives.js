'use strict';

angular.module('mean').directive('meanLabel', function() {
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        template : '<span class=\'label label-default\' ng-transclude></span>'
    };
});
