var gulp = require('gulp');

gulp.task('test', ['env:test', 'karma:unit', 'mochaTest']);

gulp.task('karma:unit', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('loadTestSchema', function () {
  require('server.js');
  require('meanio/lib/util').preload(__dirname + '/packages/**/server', 'model');
});

gulp.task('mochaTest', ['loadTestSchema'], function () {
  return gulp.src('packages/**/server/tests/**/*.js', {read: false})
    .pipe(plugins.mocha({
      reporter: 'spec'
    }));
});