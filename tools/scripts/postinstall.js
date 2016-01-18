'use strict';

var fs = require('fs'),
    npm = require('npm'),
    path = require('path'),
    shell  = require('shelljs');

function loadPackageJson(path, callback) {
  fs.readFile(path, function(err, data) {
    if (err) return callback(err);

    try {
      var pkg = JSON.parse(data.toString());
      callback(null, pkg);
    } catch (err) {
      return callback(err);
    }
  });
}

// Installs dependencies from package.json from mean packages into root node_modules
function packagesNpmInstall(source) {
  var packages = path.join(process.cwd(), source);
  npm.load({
    loglevel: 'error'
  }, function(err, npm) {
    fs.readdir(packages, function(err, files) {
      if (err && 'ENOENT' !== err.code) throw Error(err);

      if (!files || !files.length) return;
      console.log(     'Auto installing package dependencies');

      files.forEach(function(file) {
        var pkgPath = path.join(packages, file);

        loadPackageJson(path.join(pkgPath, 'package.json'), function(err, data) {
          if (err || !data.mean) return;

          var installDeps = [];

          if(data.dependencies) {
            for(var dep in data.dependencies) {
              installDeps.push(dep + '@' + data.dependencies[dep]);
            }
            if(process.env === 'development' && data.devDependencies) {
              for(var devDep in data.devDependencies) {
                installDeps.push(devDep + '@' + data.devDependencies[devDep]);
              }
            }
          }
          if(installDeps.length) {
            npm.commands.install(installDeps, function(err) {
              if (err) {
                console.log(     'Error: npm install failed');
                return console.error(err);
              } else {
                console.log('    Dependencies installed for package ' + file);
              }
            });
          }
        });
      });
    });
  });
}

shell.exec('bower update', function(code) {
  console.log('    Updating Bower dependencies');
});

packagesNpmInstall('packages/contrib');
packagesNpmInstall('packages/custom');
packagesNpmInstall('packages/core');
