'use strict';

/* jshint -W040 */

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var through = require('through');
var gutil = require('gulp-util');
var plugins = gulpLoadPlugins();
var path = require('path');

var paths = {
  js: ['./*.js', 'config/**/*.js', 'gulp/**/*.js', 'tools/**/*.js', 'packages/**/*.js', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**', '!packages/**/assets/**/js/**'],
  html: ['packages/**/*.html', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**'],
  css: ['packages/**/*.css', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**']
};

/**
 *
 * General watch/restart flow
 *
 * .js / .css files are watched by nodemon, invoke csslint, and jshint as needed before restarting and invoking livereload after
 * .html files are watched by livereload explicitly
 * app.js and dependencies watched by webpack
 *
 */

var startupTasks = ['devServe'];

gulp.task('development', startupTasks);
gulp.task('devServe', ['env:development', 'jshint', 'csslint', 'watch'], devServeTask);
gulp.task('env:development', envDevelopmentTask);

gulp.task('jshint', jshintTask);
gulp.task('csslint', csslintTask);

gulp.task('watch', watchTask);
gulp.task('livereload', livereloadTask);

////////////////////////////////////////////////////////////////////

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
        'NODE_ENV': 'development',
        'DEBUG': 'cluster'
      },
      ignore: [
        'node_modules/',
        'bower_components/',
        'bundle/',
        '../app.js',                           // handled by webpack
        'logs/',
        'packages/**/public/',
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
      this.stderr.on('data', function (chunk) {
        if (/MEAN app started/.test(chunk)) {
          setTimeout(function () {
            plugins.livereload.reload();
          }, 500)
        }
        process.stderr.write(chunk)
      });
      this.stdout.pipe(process.stdout)
    });
}

function watchTask (callback) {
  plugins.livereload.listen({
    interval: 500
  });

  gulp.watch(paths.html, ['livereload']);
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
