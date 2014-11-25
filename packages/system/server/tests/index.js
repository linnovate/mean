'use strict';

(function () {
  var mockExpress = require('mock-express');
  var index = require('../controllers/index');
  var expect = require('expect.js');

  var app = mockExpress();

  describe('<Unit Test>', function() {

    describe('System Server Controller:', function() {

      before(function(done) {
        done();
      });

      describe('Method Render', function() {
        var host = 'http://www.my.com';

        it('username should match', function (done) {
          var req = app.makeRequest({'host': host});
          req.user = {name: 'testusername', roles: ['admin']};

          var res = app.makeResponse(function (err, sideEffects) {

            expect(sideEffects.model.user.name).to.be('testusername');

            done();
          });

          index.render(req, res);
        });

        it('user should be empty', function (done) {
          var req = app.makeRequest({'host': host});
          var res = app.makeResponse(function (err, sideEffects) {

            expect(sideEffects.model.user.name).to.be(undefined);

            done();
          });

          index.render(req, res);
        });

        it('viewName should be index', function (done) {
          var req = app.makeRequest({'host': host});
          req.user = {name: 'testusername', roles: ['admin']};

          var res = app.makeResponse(function (err, sideEffects) {

            expect(sideEffects.viewName).to.be('index');

            done();
          });

          index.render(req, res);
        });

      });

      after(function(done) {

        /** Clean up
         */

        done();
      });
    });
  });

})();
