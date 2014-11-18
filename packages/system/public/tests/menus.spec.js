'use strict';

(function() {
  describe('system public services', function () {
    describe('Menus', function () {
      var _Menus;

      beforeEach(function () {

        module('mean');
        module('mean.system');

        inject(function (Menus) {
          _Menus = Menus;
        });
      });

      it('should exist', function () {
        expect(_Menus).toBeTruthy();
      });

    });
  });
}());
