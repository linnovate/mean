'use strict';

// Karma configuration
module.exports = function(config) {
  var basePath = '.';

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: basePath,

    // frameworks to use
    frameworks: ['jasmine'],
    files: [
      'app.js',
      'packages/**/public/tests/**/*.js'
    ],
    // list of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage', 'junit'],

    junitReporter: {
      outputDir: 'tests/results/public/junit/'
    },

    // coverage
    preprocessors: {
      // source files that you want to generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'packages/**/public/controllers/**/*.js': ['coverage'],
      'packages/**/public/services/**/*.js': ['coverage'],
      'packages/**/public/directives/**/*.js': ['coverage'],

      'packages/**/public/**/*.html': ['ng-html2js'],

     // 'packages/**/public/tests/**/*.js': ['webpack', 'babel'],
      'app.js': ['webpack']
    },

    webpack: require('./webpack.test.js'),
    webpackMiddleware: {
      noInfo:true
    },

    coverageReporter: {
      type: 'html',
      dir: 'tests/results/coverage/'
    },

    ngHtml2JsPreprocessor: {
      cacheIdFromPath: function(path){
        var cacheId = path;

        //Strip packages/custom/ and public/ to match the pattern of URL that mean.io uses
        cacheId = cacheId.replace('packages/custom/', '');
        cacheId = cacheId.replace('public/', '');

        return cacheId;
      }
    },

    // web server port
    port: 9876,
    // Look for server on port 3001 (invoked by mocha) - via @brownman
    proxies: {
      '/': 'http://localhost:3001/'
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    // How long will Karma wait for a message from a browser before disconnecting from it (in ms).
    browserNoActivityTimeout: 60000,
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-ng-html2js-preprocessor',
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-junit-reporter'
    ]
  });
};
