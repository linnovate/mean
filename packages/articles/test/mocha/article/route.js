'use strict';

// there has to be a better way to bootstrap package models for mocha tests
require('../../../server/models/article');

/**
 * Module dependencies.
 */
var request = require('supertest'),
    mongoose = require('mongoose'),
    app = require('../../../../../server.js'),
    session = require('../../../../../test/mocha/user/session.js'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article');

//Globals
var user;
var user2;
var article;
var article2;

var agent = request.agent(app);

//The tests
describe('<Unit Test>', function() {
    describe('Route Article:', function() {
        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            user2 = new User({
                name: 'Full name2',
                email: 'test2@test.com',
                username: 'user2',
                password: 'password'
            });

            article = new Article({
                title: 'Article Title',
                content: 'Article Content',
                user: user
            });

            article2 = new Article({
                title: 'Article Title',
                content: 'Article Content',
                user:user2

            });

            user.save(function() {

              session.login(request(app), user, function (loginAgent) {
                agent = loginAgent;
                article.save(function(err,saved) {
                  if(err) throw(err);
                  article = saved;
                  user2.save(function() {
                    article2.save(function(err,saved2) {
                      if(err) throw(err);
                      article2 = saved2;
                      done();
                    });
                  });
                });
              });


            });



        });

        describe('without authentication', function() {
            it('should get route /articles', function(done) {
                request(app).get('/articles').expect(200, done);
            });

            it('should get route /articles/_id', function(done) {
                request(app).get('/articles/'+article._id).expect(200, done);
            });

            it('should not be able to put /articles/_id', function(done) {
                request(app).put('/articles/'+article._id).expect(401,done);
            });
        });
        describe('with authentication', function() {
          it('should be able to put own /articles/_id', function(done) {
              var req = request(app).put('/articles/'+article._id);
              agent.attachCookies(req);
              req.expect(200, done);
          });
          it('should not be able to put other users /articles/_id', function(done) {
              var req = request(app).put('/articles/'+article2._id);
              agent.attachCookies(req);
              req.expect(401, done);
          });

        });
        describe('with authentication and admin role', function() {

            it('should be able to put other users /articles/_id', function(done) {
                user.roles.push('admin');
                user.save(function(err) {
                  if(err) throw(err);
                  var req = request(app).put('/articles/'+article2._id);
                  agent.attachCookies(req);
                  req.expect(200, done);
                });

            });
        });

        afterEach(function(done) {
            article.remove();
            article2.remove();
            user.remove();
            user2.remove();
            done();
        });
    });
});
