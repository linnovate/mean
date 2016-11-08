'use strict';

/* jshint -W040 */

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var through = require('through');
var gutil = require('gulp-util');
var plugins = gulpLoadPlugins();
var path = require('path');
var webpack = require('webpack-stream');
var webpackConfig = require('../webpack.config');
var plumber = require('gulp-plumber');

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
var devServeTasks = ['env:development', 'jshint', 'csslint', 'watch'];

if (process.argv.indexOf('--wdm') === -1) {
  devServeTasks.push('webpack')
}

gulp.task('development', startupTasks);
gulp.task('devServe', devServeTasks, devServeTask);
gulp.task('env:development', envDevelopmentTask);
gulp.task('webpack', webpackTask);
gulp.task('jshint', jshintTask);
gulp.task('csslint', csslintTask);

gulp.task('watch', watchTask);
gulp.task('livereload', livereloadTask);

////////////////////////////////////////////////////////////////////

function webpackTask(callback) {
  var callbackDone = false;

  webpackConfig.watch = true;
  webpackConfig.devtool = 'eval';

  return gulp.src('app.js')
      .pipe(plumber(function(){ gutil.log('[webpack]', gutil.colors.red('compiler error'))}))
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('bundle/'))
      .on('data', function(){
        if (!callbackDone) {
          callbackDone = true;
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
  var nodemonConfig = {
    script: 'server.js',
    ext: 'js css',
    env: {
      'NODE_ENV': 'development',
      'DEBUG': 'cluster'
    },
    ignore: [
      'bundle/',
      path.join(process.cwd(), 'app.js'),                           // handled by webpack
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
    args: [],
    stdout: false,
    delay: 500
  };
  if (process.argv.indexOf('--wdm') !== -1) {
    nodemonConfig.args.push('--wdm')
  }
  plugins.nodemon(nodemonConfig)
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
    })
      .on('restart', function(changed) { console.log(changed)});
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
