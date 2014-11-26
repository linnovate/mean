/* jshint -W079 */ 
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article');

/**
 * Globals
 */
var user;
var article;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Article:', function() {
    beforeEach(function(done) {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      user.save(function() {
        article = new Article({
          title: 'Article Title',
          content: 'Article Content',
          user: user
        });

        done();
      });
    });

    describe('Method Save', function() {
      it('should be able to save without problems', function(done) {
        return article.save(function(err) {
          expect(err).to.be(null);
          expect(article.title).to.equal('Article Title');
          expect(article.content).to.equal('Article Content');
          expect(article.user.length).to.not.equal(0);
          expect(article.created.length).to.not.equal(0);
          done();
        });
      });

      it('should be able to show an error when try to save without title', function(done) {
        article.title = '';

        return article.save(function(err) {
          expect(err).to.not.be(undefined);
          done();
        });
      });

      it('should be able to show an error when try to save without content', function(done) {
        article.content = '';

        return article.save(function(err) {
          expect(err).to.not.be(undefined);
          done();
        });
      });

      it('should be able to show an error when try to save without user', function(done) {
        article.user = {};

        return article.save(function(err) {
          expect(err).to.not.be(undefined);
          done();
        });
      });

    });

    afterEach(function(done) {
      article.remove(function () {
        user.remove(done);
      });
    });
  });
});
