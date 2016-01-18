'use strict';

var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  path = require('path'),
  _ = require('lodash');
var plugins = gulpLoadPlugins();
var defaultTasks = ['clean', 'cssmin', 'uglify', 'prodServe'];
var assets = require('../config/assets.json');

gulp.task('env:production', function () {
  process.env.NODE_ENV = 'production';
});

gulp.task('cssmin', function () {
  console.log('in cssmin');
  var config = tokenizeConfig(assets.core.css);

  if (config.srcGlob.length) {
    return gulp.src(config.srcGlob)
      .pipe(plugins.cssmin({keepBreaks: true}))
      .pipe(plugins.concat(config.destFile))
      .pipe(gulp.dest(path.join('bower_components/build', config.destDir)));
  }
});

gulp.task('uglify', function () {
  console.log('in uglify');
  var config = tokenizeConfig(assets.core.js);

  if (config.srcGlob.length) {
    return gulp.src(config.srcGlob)
      .pipe(plugins.concat(config.destFile))
      .pipe(plugins.uglify({mangle: false}))
      .pipe(gulp.dest(path.join('bower_components/build', config.destDir)));
  }
});

function tokenizeConfig(config) {
  var destTokens = _.keys(config)[0].split('/');

  return {
    srcGlob: _.flatten(_.values(config)),
    destDir: destTokens[destTokens.length - 2],
    destFile: destTokens[destTokens.length - 1]
  };
}

gulp.task('prodServe', ['env:production'], function () {
  plugins.nodemon({
    script: 'server.js',
    ext: 'html js',
    env: { 'NODE_ENV': 'production' } ,
    ignore: ['./node_modules/**']
  });
});
gulp.task('production',defaultTasks);
