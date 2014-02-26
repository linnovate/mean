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

exports.uninstall = function(module) {
  var npm = require("npm");

  npm.load(npm.config, function(err) {
    npm.commands.uninstall([module], function(err, data) {
      if (err) console.log(er)
      concatJs('controllers');
      concatJs('services');
      concatJs('config');
      rebuild();
      removeLinks(module);
    });

  });

  npm.on("log", function(message) {
    console.log(message);
  });
}

exports.install = function(module) {

  var npm = require("npm");

  npminstall(module);

  function npminstall(module) {
    npm.load(npm.config, function(err) {
      npm.commands.install([module], function(err, data) {
        if (err) console.log(er)

        fileStructure(function() {
          rebuild();
        });
      });

    });

    npm.on("log", function(message) {
      console.log(message);
    });
  }
}

function concatJs(name) {

  var path = 'js/' + name;

  build();

  function build() {
    fs.writeFile('./modules/public/js/sys/' + name + '.js', '//' + new Date() + '\n', function(err) {
      if (err) throw err;
      fs.readdir('./node_modules', function(err, modules) {
        modules.forEach(function(module) {
          fs.readFile('./node_modules/' + module + '/package.json', function(err, data) {;
            if (data) {
              var json = JSON.parse(data.toString());
              if (json.mean) {
                if (name == 'config') {
                  fs.readFile('./node_modules/' + module + '/public/js/config.js', function(fileErr, data) {
                    if (err) throw fileErr;
                    if (data) {
                      fs.appendFile('modules/public/js/sys/' + name + '.js', data, function(err) {
                        if (err) throw err;
                        console.log(name + '.js appended from module: ' + module + ' file: config.js');
                      });
                    }
                  });
                }

                fs.exists('./node_modules/' + module + '/public/' + path, function(exists) {
                  if (exists) {
                    fs.readdir('./node_modules/' + module + '/public/' + path, function(err, files) {
                      files.forEach(function(file) {
                        fs.readFile('./node_modules/' + module + '/public/' + path + '/' + file, function(fileErr, data) {
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
              }
            }
          });
        });
      });
    });
  }

}

function buildLinks() {
  fs.readdir('./node_modules', function(err, modules) {
    if (err) console.log(err);
    modules.forEach(function(module) {

      ///check if it is mean
      fs.readFile('./node_modules/' + module + '/package.json', function(err, data) {;
        if (data) {
          var json = JSON.parse(data.toString());
          if (json.mean) {
            fs.exists('./node_modules/' + module + '/public', function(exists) {
              if (exists) {
                fs.unlink('./modules/public/' + module, function(err) {
                  //if (err) console.log(err);
                  fs.symlink('../../node_modules/' + module + '/public', './modules/public/' + module, function(err) {
                    if (err) console.log(err);
                  })
                })
              }
            });

            fs.exists('./node_modules/' + module + '/app/views/', function(exists) {
              if (exists) {
                fs.unlink('./modules/views/' + module, function(err) {
                  //if (err) console.log(err);
                  fs.symlink('../../node_modules/' + module + '/app/views', './modules/views/' + module, function(err) {
                    if (err) console.log(err);
                  })
                })
              }
            });
          }
        }
      })
    });
  });
}

function removeLinks(module) {

  fs.exists('./modules/public/' + module, function(exists) {
    if (exists) {
      fs.unlink('./modules/public/' + module, function(err) {
        if (err) console.log(err);
      })
    }
  });

  fs.exists('./modules/views/' + module, function(exists) {
    if (exists) {
      fs.unlink('./modules/views/' + module, function(err) {
        if (err) console.log(err);
      })
    }
  });
}