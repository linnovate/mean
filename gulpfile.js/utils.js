var gulp = require('gulp');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins;

gulp.task('help', plugins.taskListing);

gulp.task('clean', function (cb) {
  return del(['bower_components/build'], cb);
});
