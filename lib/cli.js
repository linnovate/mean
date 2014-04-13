'use strict';

var fs = require('fs'),
  colors = require('colors'),
  spawn = require('child_process').spawn;

var version = require('../package').version;
var _npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

colors.setTheme({
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
  httpCode: 'blue'
});

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
      console.log('Destination is not empty: '.warn + path);
    }
  });
}

function loadPackageJson(path, callback) {
  fs.readFile(path, function(err, data) {
    if (err) return callback(true, err);

    try {
      var json = JSON.parse(data.toString());
      callback(null, json);
    } catch (err) {
      return callback(true, err);
    }
  });
}

function cloneRepo(name, options) {
  progress.start();
  var source = (options.git ? 'git@github.com:linnovate/mean.git' : 'https://github.com/linnovate/mean.git');

  // Allow specifying specific repo
  if (options.repo) {
    source = options.repo;
  }

  var git = spawn('git', ['clone', '-b', options.branch, source, name]);
  var message = 'Cloning branch: ' + options.branch + ' into destination folder: ' + name;
  console.log(message.info);

  git.stderr.setEncoding('utf8');
  git.stdout.setEncoding('utf8');

  git.on('close', function() {
    progress.stop();
    loadPackageJson('./' + name + '/package.json', function(err, data) {
      if (err) {
        console.log('Something went wrong. Try again or use --git flag'.warn);
        console.log('If the problem persists see past issues here: https://github.com/linnovate/mean/issues'.warn);
        console.log('Or open a new issue here https://github.com/linnovate/mean/issues/new'.warn);
        //fallback code here
        process.exit();
      }

      message = 'Version: ' + data.version + ' cloned';
      console.log(message.info);
      console.log();
      fs.readFile(__dirname + '/../img/logo.txt', function(err, data) {
        console.log(data.toString());
        console.log();
        console.log('   install dependencies:');
        console.log('     $ cd %s && npm install', name);
        console.log();
        console.log('   run the app:');
        console.log('     $ grunt');
        console.log();
        console.log('   Extra Docs at http://mean.io');
      });
    });
  });

  git.stdout.on('data', function(data) {
    console.log(data);
  });

  git.stderr.on('data', function(data) {
    console.error(data);
  });
}

function printNpmOutput(data) {
  var split = data.split(' ');
  split.forEach(function(str) {
    switch (str) {
      case 'WARN':
        process.stdout.write(str.warn + ' ');
        break;
      case '200':
      case '304':
      case 'GET':
        process.stdout.write(str.httpCode + ' ');
        break;
      case 'npm':
        process.stdout.write(str.data + ' ');
        break;
      case 'http':
        process.stdout.write(str.info + ' ');
        break;
      default:
        if (str) {
          process.stdout.write(str);
          if (~str.indexOf('\n')) {
            process.stdout.write(' ');
          }
        }
        break;
    }
  });
}

function checkVersion() {

  var npm = spawn(_npm, ['outdated', 'meanio', '-g', '--json']);

  npm.stderr.setEncoding('utf8');
  npm.stdout.setEncoding('utf8');

  var chunks = '';
  console.log();
  console.log('    checking meanio command line version');
  npm.on('close', function() {

    try {
      var json = JSON.parse(chunks);
      if (json.meanio.latest && json.meanio.latest < version) {
        console.log('    meanio command line is out of date'.warn);
        console.log('    Current: ' + version + ' Latest: ' + json.meanio.latest);
      } else {
        console.log('    meanio command line at latest version: '.info + version);
      }
    } catch (e) {
      console.log(e);
    }
  });

  npm.stdout.on('data', function(data) {
    chunks += data;
  });

  // npm.stderr.on('data', function(data) {
  //   console.error(data);
  // });
}

function requiresRoot(callback) {
  loadPackageJson(process.cwd() + '/package.json', function(err, data) {
    if (err || data.name !== 'mean') {
      console.log('Invalid MEAN app or not in app root'.warn);
    } else {
      callback();
    }
  });
}

function requiresCmd(cmd, callback) {
  require('which')(cmd, function(err) {
    if (err) console.log('    Prerequisite not installed: '.error + cmd);
    else callback();
  });
}

function mongoConnect(env, callback) {
  var config = require(process.cwd() + '/server/config/env/' + env + '.js');
  require('mongodb').MongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.log('    Error Connecting to database'.error);
      console.log(err);
    } else {
      console.log('    DB connection successful!'.info);
      console.log();
      callback(err, db);
    }
  });
}

exports.init = function(name, options) {
  requiresCmd('git', function() {
    ensureEmpty(name, options.force, function() {
      cloneRepo(name, options);
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

    var npm = spawn(_npm, ['install', source]);

    var message = 'Installing module: ' + module + ' from branch (version): ' + options.branch;

    console.log(message.info);
    console.log();

    npm.stderr.setEncoding('utf8');
    npm.stdout.setEncoding('utf8');

    npm.on('close', function() {
      loadPackageJson('./node_modules/' + module + '/package.json', function(err, data) {
        if (err) {
          console.log('Error: npm install failed');
          return console.log(data);
        }

        message = data.name + '@' + data.version + (data.author ? ' Author: ' + data.author.name : '');

        console.log(message.info);
        console.log();
        if (!data.mean) {
          console.log();
          console.log('Warning: The module installed is not a valid MEAN module'.warn);
        }
      });

    });

    npm.stdout.on('data', function(data) {
      printNpmOutput(data);
    });

    npm.stderr.on('data', function(data) {
      printNpmOutput(data);
    });
  });
};

exports.uninstall = function(module) {
  requiresRoot(function() {

    var npm = spawn(_npm, ['uninstall', module]);

    console.log('Removing module: '.info + module);

    npm.stderr.setEncoding('utf8');
    npm.stdout.setEncoding('utf8');

    npm.on('close', function() {
      console.log('   npm uninstall complete'.info);
    });

    npm.stdout.on('data', function(data) {
      console.log(data);
    });

    npm.stderr.on('data', function(data) {
      console.error(data);
    });
  });
};

exports.list = function() {
  requiresRoot(function() {

    console.log('   MEAN Packages List:'.info);
    console.log('   -----------------');
    //look in node_modules for external packages
    fs.readdir('./node_modules', function(err, files) {
      if (err) return console.log('   No Contrib Packages'.warn);
      files.forEach(function(file) {
        loadPackageJson('./node_modules/' + file + '/package.json', function(err, data) {
          if (!err && data.mean) console.log('   ' + 'Contrib: '.info + data.name + '@' + data.version + (data.author ? ' Author: ' + data.author.name : ''));
        });
      });
    });

    //look in packages for local modules
    fs.readdir('./packages', function(err, files) {
      if (err) return console.log('   No Custom Packages'.warn);
      files.forEach(function(file) {
        loadPackageJson('./packages/' + file + '/package.json', function(err, data) {
          if (!err && data.mean) console.log('   ' + 'Custom: '.info+ data.name + '@' + data.version + (data.author ? ' Author: ' + data.author.name : ''));
        });
      });
    });

  });
};

exports.status = function(options) {
  requiresRoot(function() {
    console.log();
    console.log('    MEAN Status'.info);
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
    ensureEmpty('./packages/' + name, options.force, function() {
      require('./scaffold.js').packages(name, options);
    });
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
        console.log('  Adding role `' + options.addRole + '` to user `' + email + '`'.info);
        update.$push = {
          roles: options.addRole
        };
        break;
      case 'r':
        console.log('  Removing role `' + options.removeRole + '` from user `' + email + '`'.info);
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
        if (err) console.log(err.message.warn);
        else console.log('successfully updated'.info);
        db.close();
      });
    });
  });
};
