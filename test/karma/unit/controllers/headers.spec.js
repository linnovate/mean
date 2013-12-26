'use strict';

(function() {
    describe('MEAN controllers', function() {
        describe('HeaderController', function() {
            // Load the controllers module
            beforeEach(module('mean'));

            var scope, HeaderController;

            beforeEach(inject(function($controller, $rootScope) {
                scope = $rootScope.$new();

                HeaderController = $controller('HeaderController', {
                    $scope: scope
                });
            }));

            it('should expose some global scope', function() {

                expect(scope.global).toBeTruthy();

            });
        });
    });
})();