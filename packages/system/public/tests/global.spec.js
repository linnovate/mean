'use strict';

(function() {
  describe('system public services', function () {
    describe('global', function () {
      var _Global;

      // executed before each "it" is run.
      beforeEach(function () {

        // load the module.
        module('mean');
        module('mean.system');

        window.user = {roles: ['admin']};

        inject(function (Global) {
          _Global = Global;
        });
      });

      // check to see if it has the expected function
      it('should exist', function () {
        expect(_Global).toBeTruthy();
      });

      it('authenticated should be true', function () {
        expect(_Global.authenticated).toBe(1);
      });

    });
  });
}());
