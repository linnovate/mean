'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    mochaTest: {
      options: {
        require: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        reporter: 'spec'
      },
      src: ['test/*/*.js']
    },
    jshint: {
      options: {
        jshintrc: true
      },
      src: ['lib/*.js']
    }
  });

  // Load grunt plugins for modules
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Register tasks
  grunt.registerTask('default', ['jshint', 'mochaTest']);
};
