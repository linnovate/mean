var
  should = require('should'),
  app = require('../../../server'),
  mongoose = require('mongoose');

describe('<Unit Test>', function() {

  describe('Model User:', function() {
    var User = mongoose.model('User'),
    user;

    beforeEach(function (done) {
      user = new User({ 
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password' 
      });
      done();
    });

    afterEach(function (done) {

      done();

    });

    describe('Method Save', function() {

      it('should be able to save whithout problems', function (done) {

        return user.save(function (err) {
          should.not.exist(err);
          done();
        });

      });

      it('should be able to show an erro when try to save witout name', function (done) {
        user.name = '';
        return user.save(function (err) {
          should.exist(err);
          done();
        });
      });

     });

  });

});
