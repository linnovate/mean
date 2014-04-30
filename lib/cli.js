'use strict';

var fs = require('fs'),
  npm = require('npm'),
  shell = require('shelljs'),
  chalk = require('chalk'),
  version = require('../package').version;

var pkgType = {
  contrib: 'Contrib',
  custom: 'Custom'
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
    if (err && 'ENOENT' !== err.code) throw err;
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
  return chalk.green('   ' + type + ': ') + data.name + '@' + data.version + author;
}

function loadPackageJson(path, callback) {
  fs.readFile(path, function(err, data) {
    if (err) return callback(err);

    try {
      var json = JSON.parse(data.toString());
      callback(null, json);
    } catch (err) {
      return callback(err);
    }
  });
}

function checkVersion() {
  console.log();
  console.log('    checking meanio command line version');

  npm.load(function(err, npm) {
    npm.config.set('global', true);
    npm.config.set('loglevel', 'warn');
    npm.commands.outdated('meanio', true, function(err, list) {
      if (err) {
        console.log(chalk.red('Error: npm install failed'));
        return console.error(err);
      }
      var latest = list[2]; // list[2] holds the 'latest' value
      if (latest < version) {
        console.log(chalk.yellow('    meanio command line is out of date'));
        console.log('    Current: ' + version + ' Latest: ' + latest);
      } else {
        console.log(chalk.green('    meanio command line at latest version:'), version);
      }
    });
  });
}

function requiresRoot(callback) {
  loadPackageJson(process.cwd() + '/package.json', function(err, data) {
    if (err || data.name !== 'mean') {
      console.log(chalk.yellow('Invalid MEAN app or not in app root'));
    } else {
      callback();
    }
  });
}

function mongoConnect(env, callback) {
  var config = require(process.cwd() + '/server/config/env/' + env + '.js');
  require('mongodb').MongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.log(chalk.red('    Error Connecting to database'));
      console.log(err);
    } else {
      console.log(chalk.green('    DB connection successful!'));
      console.log();
      callback(err, db);
    }
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

      console.log(chalk.green('Version: %s cloned'), data.version);
      console.log();
      fs.readFile(__dirname + '/../img/logo.txt', function(err, data) {
        console.log(data.toString());
        console.log();
        if (options.quick) {
          shell.cd(name);
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
              if (shell.which('grunt')) {
                shell.exec('grunt', ['-f']);
              }
            });
          });
        } else {
          console.log('   install dependencies:');
          console.log('     $ cd %s && npm install', name);
          console.log();
          console.log('   run the app:');
          console.log('     $ grunt');
          console.log();
        }
        console.log('   Extra Docs at http://mean.io');
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
      console.log('    MEAN VERSION: ' + data.version);
      console.log();
      mongoConnect(options.env, function(err, db) {
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
        console.log(chalk.green('  Adding role `' + options.addRole + '` to user `' + email + '`'));
        update.$push = {
          roles: options.addRole
        };
        break;
      case 'r':
        console.log(chalk.green('  Removing role `' + options.removeRole + '` from user `' + email + '`'));
        update.$pull = {
          roles: options.removeRole
        };
        break;
      default:
        return;
    }
    mongoConnect(options.env, function(err, db) {
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
