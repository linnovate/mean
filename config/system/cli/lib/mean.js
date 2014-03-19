fs = require('fs');



exports.list = function() {
  fs.readdir('./node_modules', function(err, files) {
    if (err) console.log(err);
    remaining = files.length;
    console.log(' MEAN Modules List:');
    console.log(' ==================');
    files.forEach(function(file) {
      fs.readFile('./node_modules/' + file + '/package.json', function(fileErr, data) {
        if (err) throw fileErr;
        if (data) {
          var json = JSON.parse(data.toString());
          if (json.mean) {
            console.log(' ' + json.name + '@' + json.version);
          }
        }
      });
    });
  });
}

exports.init = function(name, options) {
  name = (name ? name : 'mean');
  var spawn = require('child_process').spawn;
  var git = spawn('git', ['clone', 'git@github.com:linnovate/mean.git', name]);

  git.stderr.setEncoding('utf8');
  git.stdout.setEncoding('utf8');

  git.on('close', function(code, signal) {

    if (options.install) return installDependencies(name);

    console.log('   install dependencies:');
    console.log('     $ cd %s && npm install', name);
    console.log();
    console.log('   run the app:');
    console.log('     $ grunt');
    console.log();
    console.log('   Extra Docs at http://mean.io');
  });

  git.stdout.on('data', function(data) {
    console.log(data);
  });

  git.stderr.on('data', function(data) {
    console.log(data);
  });
}



function installDependencies(name) {
  var spawn = require('child_process').spawn;
  var npm = spawn('npm', ['install', name]);

  npm.stderr.setEncoding('utf8');
  npm.stdout.setEncoding('utf8');

  npm.on('close', function(code, signal) {
    console.log('   run the app:');
    console.log('     $ grunt');
    console.log();
    console.log('   Extra Docs at http://mean.io');
  });

  npm.stdout.on('data', function(data) {
    console.log(data);
  });

  npm.stderr.on('data', function(data) {
    console.log(data);
  });
}

exports.uninstall = function(module) {

  var spawn = require('child_process').spawn;
  var npm = spawn('npm', ['--registry', 'http://localhost:8008', 'uninstall', module]);

  npm.stderr.setEncoding('utf8');
  npm.stdout.setEncoding('utf8');

  npm.on('close', function(code, signal) {

  });

  npm.stdout.on('data', function(data) {
    console.log(data);
  });

  npm.stderr.on('data', function(data) {
    console.log(data);
  });

  ///////////
}

exports.install = function(module) {


  var spawn = require('child_process').spawn;
  var npm = spawn('npm', ['--registry', 'http://localhost:8008', 'install', module]);

  npm.stderr.setEncoding('utf8');
  npm.stdout.setEncoding('utf8');

  npm.on('close', function(code, signal) {
    rebuild();
  });

  npm.stdout.on('data', function(data) {
    console.log(data);
  });

  npm.stderr.on('data', function(data) {
    console.log(data);
  });
}