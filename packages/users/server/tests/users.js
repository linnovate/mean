'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Globals
 */
var user1, user2;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
    describe('Model User:', function() {

        before(function(done) {
            user1 = {
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password',
                provider: 'local'
            };

            user2 = {
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password',
                provider: 'local'
            };

            done();
        });

        describe('Method Save', function() {
            it('should begin without the test user', function(done) {
                User.find({ email: 'test@test.com' }, function(err, users) {
                    users.should.have.length(0);
                    done();
                });
            });

            it('should be able to save without problems', function(done) {

                var _user = new User(user1);
                _user.save(function(err) {
                    _user.remove();
                    done();
                });

            });

            it('should be able to create user and save user for updates without problems', function(done) {

                var _user = new User(user1);
                _user.save(function(err) {
                    should.not.exist(err);

                    _user.name = 'Full name2';
                    _user.save(function(err) {
                        should.not.exist(err);
                        _user.remove(function() {
                            done();
                        });
                    });

                });

            });

            it('should fail to save an existing user with the same values', function(done) {
                
                var _user1 = new User(user1);
                _user1.save();

                var _user2 = new User(user2);

                return _user2.save(function(err) {
                    should.exist(err);
                    _user1.remove(function() {

                        if (!err) {
                            _user2.remove(function() {
                                done();
                            });
                        }

                        done();

                    });

                });
            });

            it('should show an error when try to save without name', function(done) {
                
                var _user = new User(user1);
                _user.name = '';

                return _user.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when try to save without username', function(done) {
                
                var _user = new User(user1);
                _user.username = '';

                return _user.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when try to save without password and provider set to local', function(done) {
                
                var _user = new User(user1);
                _user.password = '';
                _user.provider = 'local';

                return _user.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should be able to to save without password and provider set to twitter', function(done) {

                var _user = new User(user1);

                _user.password = '';
                _user.provider = 'twitter';

                return _user.save(function(err) {                
                    _user.remove(function() {
                        should.not.exist(err);
                        done();
                    });
                });
            });

        });

        after(function(done) {
            
            /** Clean up user objects
             * un-necessary as they are cleaned up in each test but kept here
             * for educational purposes
             *
             *  var _user1 = new User(user1);
             *  var _user2 = new User(user2);
             *
             *  _user1.remove();
             *  _user2.remove();
             */ 

            done();
        });
    });
});
