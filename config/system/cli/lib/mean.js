fs = require('fs');

var rebuild = exports.rebuild = function(callback) {
  fileStructure(function() {
    concatJs('controllers');
    concatJs('services');
    concatJs('config');
    buildLinks();
  });
}

var fileStructure = exports.fileStructure = function(callback) {
  var mkdirp = require('mkdirp');
  mkdirp('modules/public/js/sys', function(err) {
    mkdirp('modules/views', function(err) {
      callback();
    });
  });

}

exports.list = function() {
  fs.readdir('./modules', function(err, files) {
    if (err) console.log(err);
    remaining = files.length;
    console.log(' MEAN Modules List:');
    console.log(' ==================');
    files.forEach(function(file) {
      fs.readFile('./modules/' + file + '/package.json', function(fileErr, data) {
        if (err) throw fileErr;
        if (data) {
          var json = JSON.parse(data.toString());
          console.log(' ' + json.name + '@' + json.version);
        }
      });
    });
  });
}

exports.uninstall = function(module) {
  var rimraf = require('rimraf');
  rimraf('./modules/' + module + '/', function(err) {
    if (err) throw err;
    concatJs('controllers');
    concatJs('services');
    concatJs('config');
    removeLinks(module);
  })
}

exports.install = function(module) {

  var npm = require("npm");

  npminstall(module);

  function npminstall(module) {
    npm.load(npm.config, function(err) {
      npm.commands.install([module], function(er, data) {
        if (er) console.log(er)
        if (err) return console.log(err);

        var rimraf = require('rimraf');
        rimraf('./modules/' + module, function(err) {
          if (err) throw err;
          fileStructure(function() {
            fs.rename('./node_modules/' + module, './modules/' + module, function(err) {
              if (err) console.log(err);
              rebuild();
            });
          })

        })
      });
      npm.on("log", function(message) {
        console.log(message);
      });
    });
  }

}

function concatJs(name) {

  var path = 'js/' + name;

  build();

  function build() {
    fs.writeFile('./modules/public/js/sys/' + name + '.js', '//' + new Date() + '\n', function(err) {
      if (err) throw err;
      fs.readdir('./modules', function(err, modules) {
        modules.forEach(function(module) {
          if (name == 'config') {
            fs.readFile('./modules/' + module + '/public/js/config.js', function(fileErr, data) {
              if (err) throw fileErr;
              if (data) {
                fs.appendFile('modules/public/js/sys/' + name + '.js', data, function(err) {
                  if (err) throw err;
                  console.log(name + '.js appended from module: ' + module + ' file: config.js');
                });
              }
            });
          }

          fs.exists('./modules/' + module + '/public/' + path, function(exists) {
            if (exists) {
              fs.readdir('./modules/' + module + '/public/' + path, function(err, files) {
                files.forEach(function(file) {
                  fs.readFile('./modules/' + module + '/public/' + path + '/' + file, function(fileErr, data) {
                    if (err) throw fileErr;
                    fs.appendFile('modules/public/js/sys/' + name + '.js', data, function(err) {
                      if (err) throw err;
                      console.log(name + '.js appended from module: ' + module + ' file: ' + file);
                    });
                  });
                })
              });
            }
          });
        });
      });
    });
  }

}

function buildLinks() {
  fs.readdir('./modules', function(err, modules) {
    if (err) console.log(err);
    modules.forEach(function(module) {
      if (module != 'public' && module != 'views') {
        fs.exists('./modules/' + module + '/public', function(exists) {
          if (exists) {
            fs.unlink('./modules/public/' + module, function(err) {
              //if (err) console.log(err);
              fs.symlink('../' + module + '/public', './modules/public/' + module, function(err) {
                if (err) console.log(err);
              })
            })
          }
        });

        fs.exists('./modules/' + module + '/app/views/', function(exists) {
          if (exists) {
            fs.unlink('./modules/views/' + module, function(err) {
              //if (err) console.log(err);
              fs.symlink('../' + module + '/app/views', './modules/views/' + module, function(err) {
                if (err) console.log(err);
              })
            })
          }
        });
      }
    });
  });
}

function removeLinks(module) {

  fs.unlink('./modules/public/' + module, function(err) {
    if (err) console.log(err);
  })

  fs.unlink('./modules/views/' + module, function(err) {
    if (err) console.log(err);
  })
}