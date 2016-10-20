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
  css: ['packages/**/*.css', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**'],
  less: ['packages/**/*.less', '!packages/**/_*.less', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**'],
  sass: ['packages/**/*.scss', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**']
};
var webpack = require('webpack');
var webpackConfig = require('../webpack.config.js');

/** General watch/restart flow **/
// .less / .scss files are watched by less/sass and produce .css files
// .js / .css files are watched by nodemon, invoke webpack,csslint, and jshint as needed before restarting and invoking livereload after
// .html files are watched by livereload explicitly

var startupTasks = ['devServe'];

gulp.task('development', startupTasks);
gulp.task('devServe', ['env:development', 'webpack:build-dev', 'jshint', 'csslint', 'watch'], devServeTask);
gulp.task('env:development', envDevelopmentTask);
gulp.task('webpack:build-dev', ['sass', 'less'], webpackBuild);
gulp.task('sass', sassTask);
gulp.task('less', lessTask);
gulp.task('jshint', jshintTask);
gulp.task('csslint', csslintTask);

gulp.task('webpack:rebuild-dev', webpackBuild);
gulp.task('watch', watchTask);
gulp.task('livereload', livereloadTask);

////////////////////////////////////////////////////////////////////

// modify some webpack config options
var devConfig = Object.create(webpackConfig);
devConfig.devtool = 'sourcemap';
devConfig.debug = true;
// create a single instance of the compiler to allow caching
var devCompiler = webpack(devConfig);

function webpackBuild (callback) {
  // run webpack
  devCompiler.run(function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpackBuild', err);
    }
    gutil.log('webpackBuild', stats.toString({
      colors: true
    }));
    callback()
  })
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

function lessTask () {
  return gulp.src(paths.less)
    .pipe(plugins.less())
    .pipe(gulp.dest('./packages'));
}

function sassTask () {
  return gulp.src(paths.sass)
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest('./packages'));
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
        'bundle/',                          // Causes infinite loop since webpack is tasked to run
        'logs/',
        'packages/*/*/public/assets/lib/',
        'packages/*/*/public/**/*.scss',    // Trigger off resulting css files not before scss finishes
        'packages/*/*/public/**/*.less',    // Trigger off resulting css files not before less finishes
        'packages/*/*/node_modules/',
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
          if (path.extname(file) === '.js' || path.extname(file) === '.css' && tasks.indexOf('webpack:rebuild-dev') === -1) {
            tasks.push('webpack:rebuild-dev');
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
