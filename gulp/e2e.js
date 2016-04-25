'use strict';

var gulp = require('gulp'),
  path = require('path'),
  shell = require('shelljs');

gulp.task('e2e.test', ['e2e.startServer', 'e2e.stopServer'], function(done){});

gulp.task('e2e.update', function(done){
  //Install/update webdriver requirements for Protractor e2e testing
  console.log('Protractor webdriver-manager update')
  var webdriverBin = path.join(require.resolve('protractor'), '../..', 'bin/webdriver-manager').normalize();
  shell.exec('node ' + webdriverBin + ' update', function (code, output) {
    console.log(output);
    if(code !== 0)
    {
      process.exit(code);
    }

    done();
  });
});

gulp.task('e2e.startServer', ['e2e.update'], function(done){
  var promise = require('../server.js');

  promise.then(function(app){done();});
});

gulp.task('e2e.runProtractor', ['e2e.startServer'], function(done){
  shell.exec('node node_modules/protractor/bin/protractor tests/config/e2e/protractor.config.js', function(code, output){
    done();
  });
});

gulp.task('e2e.stopServer', ['e2e.runProtractor'], function(){
  process.exit();
})
