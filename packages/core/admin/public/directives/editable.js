'use strict';

angular.module('mean.admin').directive('ngEnter', function() {
    return function(scope, elm, attrs) {
        elm.bind('keypress', function(e) {
            if (e.charCode === 13 && !e.ctrlKey) scope.$apply(attrs.ngEnter);
        });
    };
});

angular.module('mean.admin').directive('ngEditable', function() {
    return {
        // can be in-lined or async loaded by xhr
        // or inlined as JS string (using template property)
        template: '<span class="editable-wrapper">' + '<span data-ng-hide="edit" data-ng-click="edit=true;value=model;">{{model}}</span>' + '<input type="text" data-ng-model="value" data-ng-blur="edit = false; model = value" data-ng-show="edit" data-ng-enter="model=value;edit=false;"/>' + '</span>',
        scope: {
            model: '=ngEditableModel',
            update: '&ngEditable'
        },
        replace: true,
        link: function(scope, element, attrs) {
            scope.focus = function() {
                element.find('input').focus();
            };
            scope.$watch('edit', function(isEditable) {
                if (isEditable === false) {
                    scope.update();
                }
            });
        }
    };
});

angular.module('mean.admin').directive('ngEditableParagraph', function() {
    return {
        // can be in-lined or async loaded by xhr
        // or inlined as JS string (using template property)
        template: '<span class="editable-wrapper">' + '<span data-ng-hide="edit" data-ng-click="edit=true;value=model;" class="respect-newline">{{model}}</span>' + '<textarea data-ng-model="value" data-ng-blur="model=value ; edit=false" data-ng-show="edit" data-ng-enter="model=value;edit=false;" class="span8"></textarea>' + '</span>',
        scope: {
            model: '=ngEditableModel',
            update: '&ngEditableParagraph'
        },
        replace: true,
        link: function(scope, element, attrs) {
            scope.focus = function() {
                element.find('input').focus();
            };
            scope.$watch('edit', function(isEditable) {
                if (isEditable === false) {
                    scope.update();
                } else {
                    scope.focus();
                }
            });
        }
    };
});

angular.module('mean.admin').directive('ngEditableSelect', function() {
    return {
        template: '<span class="editable-wrapper">' + '<span data-ng-hide="edit" data-ng-click="edit=true;value=model;"><span data-ng-repeat="m in model">{{m}};</span></span>' + '<select data-ng-model="value" data-ng-show="edit" data-ng-multiple="true" multiple data-ng-options="option for option in options" data-ng-change="model=value;edit=false;">' + '<option value="">Choose Option</option>' + '</select>' + '</span>',
        scope: {
            text: '&ngEditableSelectText',
            model: '=ngEditableSelectModel',
            options: '=ngEditableSelectOptions',
            update: '&ngEditableSelect'
        },
        transclude: true,
        replace: true,
        link: function(scope, element, attrs) {
            scope.$watch('edit', function(isEditable) {
                if (isEditable === false) {
                    scope.update();
                }
            });
        }
    };
});
