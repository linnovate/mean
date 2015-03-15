var gulp = require('gulp'),
  karma = require('karma').server;

gulp.task('test', ['env:test', 'karma:unit', 'mochaTest']);

gulp.task('karma:unit', function (done) {
  karma.start({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('loadTestSchema', function () {
  require('../server.js');
  require('../node_modules/meanio/lib/util').preload('../packages/**/server', 'model');
});

gulp.task('mochaTest', ['loadTestSchema'], function () {
  return gulp.src('../packages/**/server/tests/**/*.js', {read: false})
    .pipe(plugins.mocha({
      reporter: 'spec'
    }));
});
