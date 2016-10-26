'use strict';

/* jshint -W040 */

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var through = require('through');
var gutil = require('gulp-util');
var plugins = gulpLoadPlugins();
var path = require('path');

var plumber = require('gulp-plumber');
var webpackStream = require('webpack-stream');
var webpack = webpackStream.webpack;
var webpackConfig = require('../webpack.config.js');
var paths = {
  js: ['./*.js', 'config/**/*.js', 'gulp/**/*.js', 'tools/**/*.js', 'packages/**/*.js', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**', '!packages/**/assets/**/js/**'],
  html: ['packages/**/*.html', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**'],
  css: ['packages/**/*.css', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**'],
  less: ['packages/**/*.less', '!packages/**/_*.less', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**'],
  sass: ['packages/**/*.scss', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**']
};

/**
 *
 * General watch/restart flow
 *
 * .less / .scss files are watched by less/sass and produce .css files
 * .js / .css files are watched by nodemon, invoke csslint, and jshint as needed before restarting and invoking livereload after
 * .html files are watched by livereload explicitly
 * app.js and dependencies watched by webpack
 *
 */

var startupTasks = ['devServe'];

gulp.task('development', startupTasks);
gulp.task('devServe', ['env:development', 'jshint', 'csslint', 'webpack', 'watch'], devServeTask);
gulp.task('env:development', envDevelopmentTask);
gulp.task('webpack', webpackTask);
gulp.task('jshint', jshintTask);
gulp.task('csslint', csslintTask);

gulp.task('watch', watchTask);
gulp.task('livereload', livereloadTask);

////////////////////////////////////////////////////////////////////

function webpackTask (callback) {
  let firstBuildReady = false;
  let callbackCalled = false;
  function done(err, stats) {
    firstBuildReady = true;
    if (err) {
      return;
    }
    if (stats.compilation.errors.length) {
      gutil.log(gutil.colors.red('webpack errors:'), stats.compilation.errors.toString({colors: true}));
    }
    if (stats.compilation.warnings.length) {
      gutil.log(gutil.colors.yellow('webpack warnings:'), stats.compilation.warnings.toString({colors: true}));
    }
  }

  webpackConfig.watch = true;
  webpackConfig.debug = true;
  webpackConfig.progress = true;
  webpackConfig.devtool = 'cheap-module-inline-source-map';

  return gulp.src('../app.js')
      .pipe(plumber({errorHandler: () => {}}))
      .pipe(webpackStream(webpackConfig, null, done))
      .pipe(gulp.dest('bundle/'))
      .on('data', function(){
        if (firstBuildReady && !callbackCalled) {
          callbackCalled = true;
          callback();
        } else {
          plugins.livereload.reload();
        }
      });
}

function jshintTask (callback) {
  gulp.src(paths.js)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(count('jshint', 'files lint free'));
  callback();
}

function envDevelopmentTask (callback) {
  process.env.NODE_ENV = 'development';
  callback();
}

function csslintTask () {
  return gulp.src(paths.css)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.formatter())
    .pipe(count('csslint', 'files lint free'));
}

function devServeTask () {
  plugins.nodemon({
      script: 'server.js',
      ext: 'js css',
      env: {
        'NODE_ENV': 'development'
      },
      ignore: [
        'node_modules/',
        'bower_components/',
        'bundle/',                          // handled by webpack
        'app.js',                           // handled by webpack
        'logs/',
        'packages/*/*/public/**',
        '.DS_Store', '**/.DS_Store',
        '.bower-*',
        '**/.bower-*',
        '**/tests'
      ],
      tasks: function (changedFiles) {
        var tasks = [];
        changedFiles.forEach(function (file) {
          if (path.extname(file) === '.css' && tasks.indexOf('csslint') === -1) {
            tasks.push('csslint');
          }
          if (path.extname(file) === '.js' && tasks.indexOf('jshint') === -1) {
            tasks.push('jshint');
          }
        });
        return tasks;
      },
      nodeArgs: ['--debug'],
      stdout: false
    })
    .on('readable', function () {
      this.stdout.on('data', function (chunk) {
        if (/Mean app started/.test(chunk)) {
          setTimeout(function () {
            plugins.livereload.reload();
          }, 500)
        }
        process.stdout.write(chunk)
      });
      this.stderr.pipe(process.stderr)
    })
    .on('restart', function () {
      plugins.livereload.reload();
    });
}

function watchTask (callback) {
  plugins.livereload.listen({
    interval: 500
  });

  gulp.watch(paths.html, ['livereload']);
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.sass, ['sass']);
  callback();
}

function livereloadTask (callback) {
  plugins.livereload.reload();
  callback();
}

function count (taskName, message) {
  var fileCount = 0;

  function countFiles (file) {
    fileCount++;
  }

  function endStream () {
    gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
    this.emit('end');
  }

  return through(countFiles, endStream);
}
