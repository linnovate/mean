'use strict';

var fs = require('fs'),
  path = require('path'),
  npm = require('npm'),
  shell = require('shelljs'),
  chalk = require('chalk'),
  request = require('request'),
  querystring = require('querystring'),
  cliVersion = require('../package').version,
  prompt = require('prompt');


var pkgType = {
  contrib: 'Contrib',
  custom: 'Custom',
  core: 'Core'
};

function Progress() {
  var interval, counter;

  function printMsg() {
    switch (counter) {
      case 0:
        console.log('Use `mean --help` from command line for all CLI options');
        break;
      case 1:
        console.log('Be sure to checkout all the docs on http://mean.io');
        break;
      case 2:
        console.log('This may take a little while depending on your connection speed');
        break;
      case 15:
        console.log('Seems a bit slow. Check your internet connection...');
        break;
      default:
        console.log('Still cloning...');
        break;
    }
    counter++;
  }

  return {
    start: function() {
      counter = 0;
      interval = setInterval(printMsg, 3000);
    },
    stop: function() {
      clearInterval(interval);
    }
  };
}
var progress = new Progress();

// From express
function emptyDirectory(path, callback) {
  fs.readdir('./' + path, function(err, files) {
    if (err && 'ENOENT' !== err.code) throw new Error(err);
    callback(!files || !files.length);
  });
}

function ensureEmpty(path, force, callback) {
  emptyDirectory(path, function(empty) {
    if (empty || force) {
      callback();
    } else {
      console.log(chalk.yellow('Destination is not empty:'), path);
    }
  });
}

function getPackageInfo(type, data) {
  if (!data) return;
  var author = data.author ? chalk.green('  Author: ') + data.author.name : '';
  if (type === pkgType.custom && data.author.name === 'Linnovate') type = pkgType.core;
  return chalk.green('   ' + type + ': ') + data.name + '@' + data.version + author;
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
}

function checkVersion() {
  console.log();
  console.log('    checking meanio command line version');

  npm.load({
    global: true,
    loglevel: 'warn'
  }, function(err, npm) {
    npm.commands.outdated('meanio', true, function(err, list) {
      if (err) {
        console.log(chalk.red('Error: npm install failed'));
        return console.error(err);
      }
      var latest = list[2]; // list[2] holds the 'latest' value
      if (latest < cliVersion) {
        console.log(chalk.yellow('    meanio command line is out of date'));
        console.log('    Current: ' + cliVersion + ' Latest: ' + latest);
      } else {
        console.log(chalk.green('    meanio command line at latest version:'), cliVersion);
      }
    });
  });
}

function requiresRoot(callback) {
  loadPackageJson(process.cwd() + '/package.json', function(err, data) {
    if (err || (data.name !== 'mean' && !data.mean)) {
      console.log(chalk.yellow('Invalid MEAN app or not in app root'));
    } else {
      callback();
    }
  });
}

function mongoConnect(env, callback) {

  loadPackageJson('./package.json', function(err, data) {
    if (err) return callback(err);

    var path = (data.meanVersion < '0.4.0' ? '/server' : '') + '/config/env/' + env + '.js';

    var config = require(process.cwd() + path);

    var db = require('mongoose').createConnection(config.db, config.dbOptions);
    db.on('error', console.error.bind(console, chalk.red('    Error Connecting to database:')));
    db.once('open', function() {
      console.log(chalk.green('    DB connection successful!'));
      console.log();
      db.options.url = config.db;
      callback(null, db);
    });
  });
}


/*

  START of Network Functions

*/

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

function readToken() {
  var file = (process.platform === 'win32') ? '_mean' : '.mean';
  var path = getUserHome() + '/' + file;

  if (!shell.test('-e', path)) return null;

  return shell.cat(path);
}

var whoami = exports.whoami = function(callback) {

  var token = readToken();

  if (token) {

    var options = {
      uri: 'https://network.mean.io/api/v0.1/whoami',
      method: 'GET',
      headers: {
        'authorization': token
      }
    };

    request(options, function(error, response, body) {
      if (!error && (response.statusCode === 200 || response.statusCode === 201)) {

        if (callback) return callback(body);
        console.log(body);

      } else {
        console.log('Client is NOT Authorized. Invalid token.');
      }
    });

  } else {

    console.log('Client is NOT Authorized.');
  }

};


var authorize = exports.authorize = function(token, callback) {

  var file = (process.platform === 'win32') ? '_mean' : '.mean';
  var path = getUserHome() + '/' + file;

  if (token) {
    fs.writeFile(path, token, function(err) {
      if (err) console.log(err);

      whoami();
    });
  } else {

    prompt.start();

    prompt.get({
        properties: {
          token: {
            hidden: true,
            required: true
          }
        }
      },
      function(err, result) {

        fs.writeFile(path, result.token, function(err) {
          if (err) console.log(err);

          whoami(callback);
        });

      });

  }
};

exports.logout = function() {

  var file = (process.platform === 'win32') ? '_mean' : '.mean';
  var path = getUserHome() + '/' + file;
  shell.rm(path);

};


exports.register = function() {

  prompt.start();

  prompt.get({
      properties: {
        name: {
          pattern: /^[a-zA-Z\s\-]+$/,
          minLength: 4,
          maxLength: 15,
          message: 'Name must be only letters, spaces, or dashes (min length of 4)',
          required: true
        },
        username: {
          minLength: 4,
          maxLength: 10,
          pattern: /^[a-zA-Z\s\-]+$/,
          message: 'Username must be only letters, spaces, or dashes (min length of 4)',
          required: true
        },
        email: {
          format: 'email',
          required: true
        },
        password: {
          minLength: 8,
          maxLength: 15,
          pattern: /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/,
          message: 'Password must be only letters, spaces, or dashes 8-15 characters long',
          hidden: true,
          required: true
        }
      }
    },
    function(err, result) {

      if (err) throw err;

      var options = {
        uri: 'https://network.mean.io/api/v0.1/user',
        method: 'POST',
        form: result,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': querystring.stringify(result).length
        }

      };

      request(options, function(error, response, body) {
        if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
          console.log('Registration Successful! \n Authorizing the mean client.');

          body = JSON.parse(body);

          authorize(body.token, function() {
            console.log('Run `mean whoami` to see authorized credentials');
          });

        } else {
          console.log('Registration Failed!');
        }
      });

    });

};

exports.addKey = function() {

  var home = getUserHome();

  var keys = shell.ls(home + '/.ssh');

  keys.forEach(function(key, index) {
    console.log('[' + (index + 1) + '] ' + key);
  });

  console.log('Select SSH key to associate to your account:');
  prompt.start();

  prompt.get({
      properties: {
        key: {
          format: 'number',
          required: true
        }
      }
    },
    function(err, result) {
      if (!keys[result.key - 1]) return console.log('Invalid selection');

      var sshKey = shell.cat(home + '/.ssh/' + keys[result.key - 1]);

      var token = readToken();

      if (token) {

        var keyData = {
          key: sshKey,
          title: keys[result.key - 1]
        };

        var options = {
          uri: 'https://network.mean.io/api/v0.1/keys',
          method: 'POST',
          form: keyData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Content-Length': querystring.stringify(keyData).length,
            'authorization': token
          }

        };

        request(options, function(error, response, body) {
          if (!error && (response.statusCode === 200 || response.statusCode === 201)) {

            console.log(body);
          } else {
            console.log('Add Key Failed!');
          }
        });

      }
    });

};


function checKeys(callback) {

  var token = readToken();
  if (!token) return console.log('Client not authorized! Use `mean authorize` or `mean register` to create a user.');

  var options = {
    uri: 'https://network.mean.io/api/v0.1/keys',
    method: 'GET',
    headers: {
      'authorization': token
    }

  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode === 200 && response.body.length) {
      callback(JSON.parse(body));
    } else {
      callback([]);
    }
  });

}


exports.publish = function() {

  loadPackageJson('./package.json', function(err, pck) {
    if (err || !pck) return console.log('You must be in a package root');

    checKeys(function(keys) {
      if (!keys.length) return console.log('You do not have any SSH keys. User `mean addKey`');

      if (!shell.which('git')) return console.log(chalk.red('    Prerequisite not installed: git'));

      publishPackage(pck, function(data) {

        shell.exec('git init', function(code) {
          if (code) return console.log(chalk.red('Error: git init failed'));

          //add gitignore here if there is not one
          if (!shell.test('-e', '.gitignore')) {
            fs.writeFileSync('.gitignore', 'node_modules');
          }

          shell.exec('git add .', function() {
            if (code) return console.log('Error: failed to add files to git');

            shell.exec('git commit -am "publish"', function() {
              //if (code) return console.log('Error: failed to commit files to git');
              shell.exec('git remote rm meanio', function() {

                shell.exec('git remote add meanio ' + data.repo, function(code) {

                  if (!code) {
                    shell.exec('git push -u meanio master', function(code) {

                      if (!code) {
                        console.log('Publish Success! ' + data.name + ' distribution ( master ) ' + data.version);
                      }
                    });
                  }
                });
              });
            });
          });
        });
      });
    });

  });
};

function publishPackage(data, callback) {

  var body = {
    name: data.name,
    description: data.description,
    version: data.version,
    keywords: data.keywords
  };

  var token = readToken();

  var options = {
    uri: 'https://network.mean.io/api/v0.1/packages/publish',
    method: 'POST',
    form: querystring.stringify(body),
    headers: {
      'Content-Type': 'multipart/form-data',
      'Content-Length': querystring.stringify(body).length,
      'authorization': token
    }

  };

  request(options, function(error, response, body) {
    if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
      callback(JSON.parse(body));
    } else {
      console.log('Failed to publish: ');
      console.log(error);
    }
  });
}

exports.search = function(keywords) {

  var options = {
    uri: 'https://network.mean.io/api/v0.1/packages/search?q=' + keywords,
    method: 'GET'
  };

  request(options, function(error, response, body) {

    if (!error && (response.statusCode === 200 || response.statusCode === 201)) {

      var results = JSON.parse(body);
      console.log(chalk.green(results.length + ' found.'));
      results.forEach(function(pkg) {
        console.log(chalk.green(pkg.name) + ' ' + pkg.description + chalk.green(' by: ') + JSON.stringify(pkg.authors));
      });
    } else {

      console.log(error);
    }
  });
};


/*

  END OF NETWORK FUNCTIONS

*/
exports.init = function(name, options) {
  if (!shell.which('git')) return console.log(chalk.red('    Prerequisite not installed: git'));

  var source = (options.git ? 'git@github.com:linnovate/mean.git' : 'https://github.com/linnovate/mean.git');

  // Allow specifying specific repo
  if (options.repo) {
    source = options.repo;
  }

  console.log(chalk.green('Cloning branch: %s into destination folder:'), options.branch, name);

  progress.start();
  source = options.branch + ' ' + source + ' ' + name;
  shell.exec('git clone -b ' + source, function(code) {
    progress.stop();
    if (code) return console.log(chalk.red('Error: git clone failed'));

    loadPackageJson('./' + name + '/package.json', function(err, data) {
      if (err) {
        console.log(chalk.yellow('Something went wrong. Try again or use --git flag'));
        console.log(chalk.yellow('If the problem persists see past issues here: https://github.com/linnovate/mean/issues'));
        console.log(chalk.yellow('Or open a new issue here https://github.com/linnovate/mean/issues/new'));
        //fallback code here
        process.exit();
      }

      console.log(chalk.green('Version: %s cloned'), data.meanVersion);
      console.log();

      fs.readFile(__dirname + '/../img/logo.txt', function(err, data) {
        console.log(data.toString());
        console.log();

        shell.cd(name);
        shell.exec('git remote rename origin upstream', function(code) {
          if (!code) {
            console.log('   git remote upstream set');
            console.log();
          }
        });

        var grunted = shell.which('grunt');

        if (options.quick) {
          npm.load(function(err, npm) {
            console.log(chalk.green('   installing dependencies...'));
            console.log();
            npm.commands.install(function(err) {
              if (err) {
                console.log(chalk.red('Error: npm install failed'));
                return console.error(err);
              }
              console.log(chalk.green('   running the mean app...'));
              console.log();
              if (grunted) {
                shell.exec('grunt', ['-f']);
              } else {
                shell.exec('node server');
              }
            });
          });
        } else {
          console.log('   install dependencies:');
          console.log('     $ cd %s && npm install', name);
          console.log();
          console.log('   run the app:');
          console.log('     $', grunted ? 'grunt' : 'node server');
          console.log();
        }
        console.log('   Extra Docs at http://mean.io');
        console.log();
      });
    });
  });
};

exports.postinstall = function() {

  // return test1();

  requiresRoot(function() {
    console.log(chalk.green('Installing Bower depenedencies'));
    require('bower').commands.install().on('error', function(err) {
      console.log(chalk.red(err));
    });

    var packages = path.join(process.cwd(), 'packages');
    npm.load({
      loglevel: 'error'
    }, function(err, npm) {
      fs.readdir(packages, function(err, files) {
        if (err && 'ENOENT' !== err.code) throw Error(err);

        if (!files || !files.length) return;
        console.log(chalk.green('Auto installing package dependencies'));

        files.forEach(function(file) {
          var pkgPath = path.join(packages, file);
          loadPackageJson(path.join(pkgPath, 'package.json'), function(err, data) {
            if (err || !data.mean) return;

            npm.commands.install(pkgPath, [pkgPath], function(err) {
              if (err) {
                console.log(chalk.red('Error: npm install failed'));
                return console.error(err);
              } else {
                console.log(chalk.green('    Dependencies installed for package ' + file));
              }
            });
          });
        });
      });
    });
  });
};

function test1() {
  loadPackageJson('./mean.json', function(err, data) {
    console.log(data.dependencies);

    for (var dep in data.dependencies) {
      console.log(dep);
      //yonatan
      //shell.exec('node node_modules/meanio/bin/mean-install ' + dep, function(code) {
      console.log(chalk.green('    Installing package ' + dep));

      shell.exec('node /home/yonatan/Repos/linnovate/meanio/bin/mean-install ' + dep, function(code) {
        console.log(code);

      });
    }
  });
}

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

exports.install = function(module, options) {
  requiresRoot(function() {

    loadPackageJson('./node_modules/meanio/package.json', function(err, data) {

      var destination = 'packages/contrib/';

      if (err || data.version < '0.5.18') destination = 'node_modules/';

      module = module.split('@');

      var packageName = module[0];
      var tag = module[1] || 'master';

      getPackage(packageName, function(data) {
        console.log(chalk.green('Installing module: %s:'), module[0]);

        var cloneUrl = options.git ? data.repo : 'https://git.mean.io/' + data.repo.split(':')[1];

        shell.rm('-rf', destination + data.name);

        console.log('git clone --branch ' + tag + ' ' + cloneUrl + ' ' + destination + data.name);

        var silentState = shell.config.silent; // save old silent state
        shell.config.silent = true;

        shell.exec('git clone --branch ' + tag + ' ' + cloneUrl + ' ' + destination + data.name, function(code) {

          shell.config.silent = silentState;

          if (code) return console.log('Failed to clone repo');


          var pkgPath = destination + data.name;

          shell.rm('-rf', destination + data.name + '/.git');
          shell.rm('-rf', destination + data.name + '/.gitignore');

          shell.cd(pkgPath);

          shell.exec('npm install .', function(code) {

            if (code) return console.log(code);

            loadPackageJson('./package.json', function(err, data) {
              if (err) return console.error(err);

              console.log();
              if (!data.mean) {
                console.log();
                console.log(chalk.yellow('Warning: The module installed is not a valid MEAN module'));
              }
            });
          });
        });
      });
    });
  });
};

exports.uninstall = function(module) {
  requiresRoot(function() {
    console.log(chalk.yellow('Removing module:'), module);

    if (!shell.test('-d', './packages/contrib/' + module)) {
      shell.rm('-rf', './packages/contrib/' + module);
    }

    if (!shell.test('-d', './node_modules/' + module)) {
      shell.rm('-rf', './node_modules/' + module);
    }

    console.log(chalk.green('   uninstall complete'));
  });
};

exports.list = function() {
  requiresRoot(function() {

    console.log(chalk.green('   MEAN Packages List:'));
    console.log('   -----------------');

    function look(type) {
      var path = './packages/' + type + '/';

      fs.readdir(path, function(err, files) {
        if (err || !files.length) return console.log(chalk.yellow('   No ' + type + ' Packages'));
        files.forEach(function(file) {
          loadPackageJson(path + file + '/package.json', function(err, data) {
            if (!err && data.mean) console.log(getPackageInfo(type, data));
          });
        });
      });
    }
    // look in node_modules for external packages
    look('core');

    // look in node_modules for external packages
    look('contrib');

    // look in packages for local packages
    look('custom');
  });
};

exports.status = function(options) {
  requiresRoot(function() {
    console.log();
    console.log(chalk.green('    MEAN Status'));
    console.log('    -----------');
    console.log();
    loadPackageJson('./package.json', function(err, data) {
      if (err) throw new Error(err);
      console.log('    MEAN VERSION: ' + data.meanVersion);
      console.log();
      mongoConnect(options.env, function(err, db) {
        if (err) throw new Error(err);
        console.log('    MongoDB URI: ' + db.options.url);
        checkVersion();
        db.close();
      });
    });
  });
};

exports.pkg = function(name, options) {
  requiresRoot(function() {
    if (options.delete) {
      console.log(chalk.yellow('Removing package:'), name);
      shell.rm('-rf', './packages/' + name);
    } else {
      ensureEmpty('./packages/' + name, options.force, function() {
        require('./scaffold.js').packages(name, options);
      });
    }
  });
};

exports.printUser = function(email, options) {
  requiresRoot(function() {
    mongoConnect(options.env, function(err, db) {
      if (err) throw new Error(err);
      db.collection('users').find({
        email: email
      }).toArray(function(err, user) {
        console.dir(user);
        db.close();
      });
    });
  });
};

exports.updateRole = function(email, options, type) {
  requiresRoot(function() {
    var update = {};
    switch (type) {
      case 'a':
        console.log('  Adding role `' + options.addRole + '` to user `' + email + '`');
        update.$push = {
          roles: options.addRole
        };
        break;
      case 'r':
        console.log('  Removing role `' + options.removeRole + '` from user `' + email + '`');
        update.$pull = {
          roles: options.removeRole
        };
        break;
      default:
        return;
    }
    mongoConnect(options.env, function(err, db) {
      if (err) throw new Error(err);
      db.collection('users').update({
        email: email
      }, update, {
        w: 1,
        upsert: false,
        multi: false
      }, function(err) {
        if (err) console.error(err);
        else console.log(chalk.green('successfully updated'));
        db.close();
      });
    });
  });
};
