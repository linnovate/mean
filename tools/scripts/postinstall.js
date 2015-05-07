var fs = require('fs'),
    npm = require('npm'),
    path = require('path'),
    request = require('request'),
    shell  = require('shelljs');


function getPackage(name, callback) {

  var options = {
    uri: 'https://network.mean.io/api/v0.1/packages/' + name,
    method: 'GET'
  };

  request(options, function(error, response, body) {
    if (!error && (response.statusCode === 200 || response.statusCode === 201)) {

      if (callback) return callback(JSON.parse(body));


    } else {
      console.log('Package not found.');
    }
  });
}



function install(module, options) {
  options = options || {};

    loadPackageJson('./node_modules/meanio/package.json', function(err, data) {

      var destination = 'packages/contrib/';

      if (err || data.version < '0.5.18') destination = 'node_modules/'; //what about the version???

      var packageName = module.split('@')[0];

      var tag = 'master';

      tag = tag === 'latest' ? 'master' : tag;

      getPackage(packageName, function(data) {
        console.log(     'Installing module: %s:', packageName);

        if (data.repo.indexOf('git.mean.io') === -1) {
          options.git = true;
        }
        
        var cloneUrl = options.git ? data.repo : 'https://git.mean.io/' + data.repo.split(':')[1];

        shell.rm('-rf', destination + data.name);

        console.log('git clone --branch ' + tag + ' ' + cloneUrl + ' ' + destination + data.name);

        var silentState = shell.config.silent; // save old silent state
        shell.config.silent = true;

        shell.exec('git clone --branch ' + tag + ' --depth 1 ' + cloneUrl + ' ' + destination + data.name, function(code) {

          shell.config.silent = silentState;

          if (code) return console.log('Failed to clone repo');


          var pkgPath = destination + data.name;

          shell.rm('-rf', destination + data.name + '/.git');
          shell.rm('-rf', destination + data.name + '/.gitignore');

          // Load mean.json
          packagesMeanJson(__dirname);

          if (options.skipNpm) return;

          // Load package.json
          loadPackageJson(pkgPath + '/package.json', function(err, data) {
            if (err) return console.error(err);

            console.log();
            if (!data.mean) {
              console.log();
              console.log(     'Warning: The module installed is not a valid MEAN module');
            }

            shell.cd(pkgPath);

            shell.exec('npm install .', function(code) {

              if (code) return console.log(code);

              console.log(     '    Dependencies installed for package ' + data.name);

              require('bower').commands.install().on('error', function(err) {
                console.log('    ' + err + ' ' + data.name);
              });

            });
          });
        });
      });
    });
};

function packagesMeanJson(source) {
  // Load mean.json
  loadPackageJson(path.join(source, 'mean.json'), function(err, data) {
    if (err || !data) return;

    for (var dep in data.dependencies) {
      shell.cd(process.cwd());
      install(dep + '@' + data.dependencies[dep]);
    }
  });
}




function loadPackageJson(path, callback) {
  fs.readFile(path, function(err, data) {
    if (err) return callback(err);

    try {
      var pkg = JSON.parse(data.toString());
      pkg.meanVersion = pkg.mean || pkg.version;
      callback(null, pkg);
    } catch (err) {
      return callback(err);
    }
  });
};


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

        packagesMeanJson(pkgPath);

        loadPackageJson(path.join(pkgPath, 'package.json'), function(err, data) {
          if (err || !data.mean) return;

          npm.commands.install(pkgPath, [pkgPath], function(err) {
            if (err) {
              console.log(     'Error: npm install failed');
              return console.error(err);
            } else {
              console.log('    Dependencies installed for package ' + file);
            }
          });
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

// Load mean.json

var source = process.cwd();
packagesMeanJson(source);





