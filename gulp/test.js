'use strict';

var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  request = require('request'),
  KarmaServer = require('karma').Server,
  fs = require('fs'),
  path = require('path');

var plugins = gulpLoadPlugins();

process.env.NODE_ENV = 'test';

gulp.task('test', ['startServer', 'stopServer']);
gulp.task('startServer', function(done) {
  var promise = require('../server.js');
  promise.then(function(app){done();});
});
gulp.task('stopServer', ['runKarma'], function() {
  process.exit();
});
gulp.task('runMocha', ['startServer'], function () {
  return gulp.src('./packages/**/server/tests/**/*.spec.js', {read: false})
    .pipe(plugins.mocha({
      reporter: 'spec'
    }))
    .on('error', function(error){
      console.error(error);
      this.emit('end');
    });
});
gulp.task('runKarma', ['runMocha'], function (done) {

  var karma = new KarmaServer({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: true
  }, function () {
    done();
  });

  karma.start();
});
