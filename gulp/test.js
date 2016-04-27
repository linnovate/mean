'use strict';

var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  request = require('request'),
  KarmaServer = require('karma').Server,
  fs = require('fs'),
  path = require('path');

var plugins = gulpLoadPlugins();

process.env.NODE_ENV = 'test';

function processIncludes(aggregatedAssets) {

  // Process all node_modules, find mean packages, and map directory names
  var dirmap = [];
  var nodemods = __dirname + '/../node_modules';
  fs.readdirSync(nodemods).forEach(function(file) {
    try {
      var data = fs.readFileSync(path.join(nodemods, file, 'mean.json'));
      if (data) {
        var json = JSON.parse(data.toString());
        if (json.name) {
          dirmap[file] = json.name;
        }
      }
    } catch (e) {
      // not a file
    }
  });

  for(var i = 0; i < aggregatedAssets.length; ++i) {
    aggregatedAssets[i] = aggregatedAssets[i].slice(1);
    if(aggregatedAssets[i].indexOf('bower_components/') === -1) {
      var index = aggregatedAssets[i].indexOf('/') + 1;
      var packageName = aggregatedAssets[i].substring(0, index-1);
      var nmIndex = -1;
      for(var dirName in dirmap) {
        if(dirmap[dirName] === packageName) {
          nmIndex = dirName;
          break;
        }
      }
      if(nmIndex === -1) {
        aggregatedAssets[i] = aggregatedAssets[i].substring(0, index) + 'public/' + aggregatedAssets[i].substring(index);
      } else {
        aggregatedAssets[i] = 'node_modules/' + nmIndex + '/public/' + aggregatedAssets[i].substring(index);
      }
    }
    try {
      fs.lstatSync(__dirname + '/../packages/core/' + aggregatedAssets[i]);
      aggregatedAssets[i] = 'packages/core/' + aggregatedAssets[i];
      continue;
    } catch(e) {
      // Not a file
    }
    try {
      fs.lstatSync(__dirname + '/../packages/custom/' + aggregatedAssets[i]);
      aggregatedAssets[i] = 'packages/custom/' + aggregatedAssets[i];
    } catch (e) {
      // Not a file
    }
  }
  return aggregatedAssets;
}

gulp.task('test', ['startServer', 'stopServer']);
gulp.task('startServer', function(done) {
  var promise = require('../server.js');

  promise.then(function(app){done();});
});
gulp.task('stopServer', ['runKarma'], function() {
  process.exit();
});
gulp.task('runMocha', ['startServer'], function () {
  return gulp.src('./packages/**/server/tests/**/*.spec.js', {read: false})
    .pipe(plugins.mocha({
      reporter: 'spec'
    }))
    .on('error', function(error){
      console.error(error);
      this.emit('end');
    });
});
gulp.task('runKarma', ['runMocha'], function (done) {
  request('http://localhost:3001/api/aggregatedassets', function(error, response, body) {
    var aggregatedassets = JSON.parse(body);
    aggregatedassets = processIncludes(aggregatedassets.footer.js);

    var karma = new KarmaServer({
      configFile: __dirname + '/../karma.conf.js',
      singleRun: true,
      files: aggregatedassets.concat(['packages/**/public/tests/**/*.js', 'packages/**/public/**/*.html'])
    }, function () {
      done();
    });

    karma.start();
  });
});

// function mapFile(dirmap, promise, file, err, data) {
//   if(!err) {
//     var json = JSON.parse(data.toString());
//     if(json.name) {
//       dirmap[file] = json.name;
//     }
//     promise.resolve();
//   }
//   else {
//     promise.resolve();
//   }
// }
