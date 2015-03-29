var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  karma = require('karma').server;
var plugins = gulpLoadPlugins();
var defaultTasks = ['env:test', 'karma:unit', 'mochaTest'];

gulp.task('env:test', function () {
  process.env.NODE_ENV = 'test';
});

gulp.task('karma:unit', function (done) {
  karma.start({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('loadTestSchema', function () {
  require('../server.js');
  require('../node_modules/meanio/lib/core_modules/module/util').preload('../packages/**/server', 'model');
});

gulp.task('mochaTest', ['loadTestSchema'], function () {
  return gulp.src('../packages/**/server/tests/**/*.js', {read: false})
    .pipe(plugins.mocha({
      reporter: 'spec'
    }));
});

gulp.task('test', defaultTasks);
