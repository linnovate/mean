'use strict';

var fs = require('fs'),
  path = require('path'),
  npm = require('npm'),
  shell = require('shelljs'),
  chalk = require('chalk'),
  cliVersion = require('../package').version;

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

    var path = (data.version < '0.4.0' ? '/server' : '') + '/config/env/' + env + '.js';

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

exports.install = function(module, options) {
  requiresRoot(function() {
    var source = 'https://github.com/linnovate/' + module + '/tarball/' + options.branch;

    // Allow specifying specific repo
    if (options.repo) {
      source = options.repo;
    }

    // Allow installing packages from npm
    if (options.npm) {
      source = module;
    }

    console.log(chalk.green('Installing module: %s from branch (version):'), module, options.branch);
    console.log();

    npm.load(function(err, npm) {
      npm.commands.install([source], function(err) {
        if (err) {
          console.log(chalk.red('Error: npm install failed'));
          return console.error(err);
        }

        loadPackageJson('./node_modules/' + module + '/package.json', function(err, data) {
          if (err) return console.error(err);

          console.log();
          console.log(getPackageInfo(pkgType.contrib, data));
          if (!data.mean) {
            console.log();
            console.log(chalk.yellow('Warning: The module installed is not a valid MEAN module'));
          }
        });
      });
    });
  });
};

exports.uninstall = function(module) {
  requiresRoot(function() {
    console.log(chalk.yellow('Removing module:'), module);

    npm.load(function(err, npm) {
      npm.commands.uninstall([module], function(err) {
        if (err) {
          console.log(chalk.red('Error: npm install failed'));
          return console.error(err);
        }
        console.log(chalk.green('   npm uninstall complete'));
      });
    });
  });
};

exports.list = function() {
  requiresRoot(function() {

    console.log(chalk.green('   MEAN Packages List:'));
    console.log('   -----------------');

    function look(type) {
      var path = type === pkgType.contrib ? './node_modules/' : './packages/';
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
    look(pkgType.contrib);

    // look in packages for local packages
    look(pkgType.custom);
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
