'use strict';

var mean = require('../..'),
  should = require('should');

/* jshint -W030 */
describe('mean.js', function() {

  it('exports an object', function() {
    should.exist(mean);
    mean.should.be.an.Object;
  });

  var menus;
  before(function() {
    menus = new mean.Menus();
  });
  it('creates an empty menu array', function() {
    menus.get().should.be.an.Array.and.be.empty;
  });
  it('adds a menu', function() {
    menus.add({
      title: 'test'
    });
    menus.get().should.eql([{
      title: 'test',
      menu: 'main',
      roles: ['anonymous']
    }]);
  });
  it('adds 2 menus', function() {
    menus.get().should.be.an.Array.and.have.length(1); // 1 anonymous
    menus.add({
      title: 'auth',
      roles: ['authenticated']
    }, {
      title: 'mocha',
      roles: ['mocha']
    });
    menus.get({
      roles: ['authenticated']
    }).should.be.an.Array.and.have.length(2); // anonymous, authenticated
  });

  it('properly weight js footer menus', function(done) {
    mean.aggregated('js', 'footer', function(aggr) {
      aggr.should.be.empty;
      done();
    });
  });
});
