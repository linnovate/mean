'use strict';

/**
 * Load Prerequisites
 */
var expect = require('expect.js'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  Comment = mongoose.model('Comment')
  ;

/**
 * This will hold all temporarily added records, which will be deleted at the end of the tests
 * @type {Object}
 */
var temps = {};

describe('<Unit Test>', function() {
  describe('Model Comment:', function() {
    beforeEach(function(done) {
      temps = {};
      /**
       * Create a new test user
       * @type {User}
       */
      temps.user = new User({
        name: 'John Doe',
        email: 'test@example.com',
        username: 'john.doe',
        password: '123456'
      });

      temps.user.save(function() {        
        /**
         * Create a new test Article
         * @type {Article}
         */
        temps.article = new Article({
          title: 'Article Title',
          content: 'Article Content',
          user: temps.user
        });

        temps.article.save(function() {
          temps.comment = new Comment({
            content: 'This is a good article',
            article: temps.article
          });
          temps.comment2 = new Comment({
            content: 'This is a good article for authenticated user',
            article: temps.article,
            user: temps.user
          });
          done();
        });
      });
    });

    /**
     * Save comment
     */
    describe('Method Save', function() {
      
      it('should be able to save WITHOUT user param', function(done) {
        return temps.comment.save(function(err) {
          expect(err).to.be(null);
          expect(temps.comment.content).to.equal('This is a good article');
          expect(temps.comment.published).to.be(false);
          expect(temps.comment.user).to.equal(undefined);
          expect(temps.comment.article).to.equal(temps.article._id);
          done();
        });
      });

      it('should be able to save WITH user param', function(done) {
        return temps.comment2.save(function(err) {
          expect(err).to.be(null);
          expect(temps.comment2.content).to.equal('This is a good article for authenticated user');
          expect(temps.comment2.published).to.be(false);
          expect(temps.comment2.user).to.equal(temps.user._id);
          expect(temps.comment2.article).to.equal(temps.article._id);
          done();
        });
      });

      it('should be able to save WITH user param', function(done) {
        return temps.comment2.save(function(err) {
          expect(err).to.be(null);
          expect(temps.comment2.content).to.equal('This is a good article for authenticated user');
          expect(temps.comment2.published).to.be(false);
          expect(temps.comment2.user).to.equal(temps.user._id);
          expect(temps.comment2.article).to.equal(temps.article._id);
          done();
        });
      });
      
    });
  

    /**
     * Clean up
     */
    afterEach(function(done) {
      var remove = function(item, ok) {
        if (item && typeof item.remove === "function") {
          item.remove(ok);
        } else {
          ok();
        }
      };
      remove(temps.article, function () {
        remove(temps.user, function() {
          remove(temps.comment, function() {
            done();
          });
        });
      });
    });

  });
});

