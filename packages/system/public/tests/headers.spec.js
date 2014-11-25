'use strict';

(function() {
  describe('MEAN controllers', function() {
    describe('HeaderController', function() {
      beforeEach(function() {
        module('mean');
        module('mean.system');
      });

      var scope, HeaderController;

      var Menus = {};
      Menus.query = function (item, success) {
        success({name : 'my menu'});
      };


      beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();

        HeaderController = $controller('HeaderController', {
          $scope: scope,
          Menus: Menus
        });
      }));

      it('should expose some global scope', function() {
        expect(scope.global).toBeTruthy();
      });

      it('should load main menu', function() {
        scope.$emit('loggedin');
        expect(scope.menus.main.name).toBe('my menu');
      });

    });
  });
})();
