var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  request = require('request'),
  karma = require('karma').server,
  _ = require('lodash'),
  fs = require('fs'),
  assets = require('../config/assets.json');
var plugins = gulpLoadPlugins();

process.env.NODE_ENV = 'test';


gulp.task('test', ['startServer', 'stopServer']);
gulp.task('startServer', function(done) {
  require('../server.js');
  require('../node_modules/meanio/lib/core_modules/module/util').preload('../packages/**/server', 'model');
  done();
});
gulp.task('stopServer', ['runKarma'], function() {
  process.exit();
});
gulp.task('runMocha', ['startServer'], function () {
  return gulp.src('./packages/**/server/tests/**/*.js', {read: false})
    .pipe(plugins.mocha({
      reporter: 'spec'
    }));
});
gulp.task('runKarma', ['runMocha'], function (done) {
  request('http://localhost:3001/api/aggregatedassets', function(error, response, body) {
    var aggregatedassets = JSON.parse(body);
    aggregatedassets = processIncludes(aggregatedassets.footer.js);

    karma.start({
      configFile: __dirname + '/../karma.conf.js',
      singleRun: true,
      files: aggregatedassets.concat(['packages/**/public/tests/*.js'])
    }, function () {
      done();
    });
  });
});

function processIncludes(aggregatedAssets) {
  for(var i = 0; i < aggregatedAssets.length; ++i) {
    aggregatedAssets[i] = aggregatedAssets[i].slice(1);
    if(aggregatedAssets[i].indexOf('bower_components/') == -1) {
      var index = aggregatedAssets[i].indexOf('/') + 1;
      aggregatedAssets[i] = aggregatedAssets[i].substring(0, index) + "public/" + aggregatedAssets[i].substring(index);
    }
    try {
      var stats = fs.lstatSync(__dirname + '/../packages/core/' + aggregatedAssets[i]);
      aggregatedAssets[i] = 'packages/core/' + aggregatedAssets[i];
      continue;
    } catch(e) {
      // Not a file
    }
    try {
      stats = fs.lstatSync(__dirname + '/../packages/custom/' + aggregatedAssets[i]);
      aggregatedAssets[i] = 'packages/custom/' + aggregatedAssets[i];
    } catch (e) {
      // Not a file
    }
  }
  return aggregatedAssets;
}