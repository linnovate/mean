'use strict';

//Common directives
angular.module('mean.articles')
    .directive('checkout',['Cart', function(Cart) {
        return {
            restrict: 'A',
            template:   '<div data-ng-repeat="item in items">' +
            '<div class="clearfix item-box">'+
            '<div class="col-md-2 text-left item-pic"><img class="img-responsive img-rounded" alt="{{item.title}}" data-ng-src="/public/upload/{{item.pic}}"></div>'+
            '<div class="col-md-2 text-left item-quantity">{{item.quantity}}</div>'+
            '<div class="col-md-4 text-left item-title">{{item.title}}</div>'+
            '<div class="col-md-4 text-right item-subtot">{{ (item.price  * item.quantity) | number:2 }}</div>'+
            '</div>'+
            '</div>'+
            '<div class="text-right">{{ \'article.labels.total\' | translate}}: {{tot | number:2}}</div>',
            controller: function($scope,$element) {
                $scope.items = Cart.get();
                $scope.tot = Cart.getTotal();
            }
        };
    }]);