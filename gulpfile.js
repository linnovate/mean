'use strict';

var gulp = require('gulp');

var env = process.env.NODE_ENV || 'development';
/*
var defaultTasks = ['clean', 'jshint', 'csslint','serve','watch']; // initialize with development settings
if (env === 'production') { var defaultTasks = ['clean', 'cssmin', 'uglify', 'serve', 'watch'];}
if (env === 'test')       { var defaultTasks = ['env:test', 'karma:unit', 'mochaTest'];}
*/
// read gulp directory contents for the tasks...
require('require-dir')('./gulp');
console.log('Invoking gulp -',env);
gulp.task('default', ['clean'], function (defaultTasks) {
  // run with paramater
  gulp.start(env);
});
