'use strict';

var fs = require('fs'),
  shell = require('shelljs'),
  chalk = require('chalk');

var data = {};

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function camelCase(str) {
  str = str.toLowerCase();
  var parts = str.split(/[\-_ \s]/);
  str = null;
  for (var i = 0; i < parts.length; i++) {
    str = (str ? str + capitaliseFirstLetter(parts[i]) : parts[i]);
  }
  return str;
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */
function write(path, str) {
  fs.writeFile(path, str);
  console.log(chalk.cyan('   create:'), path);
}

/**
 * Read template files
 *
 * @param {String} path
 */
function readTemplate(path) {
  var template = fs.readFileSync(__dirname + '/templates/' + path, 'utf8');
  for (var index in data) {
    template = template.split('__' + index + '__').join(data[index]);
  }
  return template;
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */
function mkdir(path, fn) {
  shell.mkdir('-p', path);
  shell.chmod(755, path);
  console.log(chalk.cyan('   create:'), path);
  if (fn) fn();
}

function buildDirectoryStructure() {
  var name = data.name;
  var source = 'packages';
  // If older version of mean we will put it in node_modules
  var meanVersion = require(process.cwd() + '/package.json').version;

  if (meanVersion < '0.3.2') {
    source = 'node_modules';
  }
  var path = './' + source + '/' + name;

  console.log('Files saved in ' + source + '/' + name);

  mkdir(path, function() {
    write(path + '/app.js', readTemplate('app.js'));
    write(path + '/package.json', readTemplate('package.json'));
    write(path + '/README.md', 'README: ' + name);
  });

  mkdir(path + '/server');

  mkdir(path + '/public');
  mkdir(path + '/public/assets');
  mkdir(path + '/public/assets/css', function() {
    write(path + '/public/assets/css/' + name + '.css', '.' + name + '_example h1:{background-color:purple}');
  });
  mkdir(path + '/public/assets/img', function() {
    fs.createReadStream(__dirname + '/../img/meanlogo.png').pipe(fs.createWriteStream(path + '/public/assets/img/logo.png'));
  });

  mkdir(path + '/public/config', function() {
    write(path + '/public/config/routes.js', readTemplate('client/routes.js'));
  });
  mkdir(path + '/public/controllers', function() {
    write(path + '/public/controllers/' + name + '.js', readTemplate('client/controller.js'));
  });
  mkdir(path + '/public/services', function() {
    // write(path + '/public/services/' + name + '.js', readTemplate('client/service.js'));
  });
  mkdir(path + '/public/views', function() {
    write(path + '/public/views/index.html', readTemplate('client/view.html'));
  });

  mkdir(path + '/server');
  mkdir(path + '/server/models');
  mkdir(path + '/server/controllers');
  mkdir(path + '/server/config');
  mkdir(path + '/server/views', function() {
    write(path + '/server/views/index.html', readTemplate('server/view.html'));
  });
  mkdir(path + '/server/routes', function() {
    write(path + '/server/routes/' + name + '.js', readTemplate('server/routes.js'));
  });
}

exports.packages = function(name, options) {

  name = camelCase(name);

  data = {
    name: name,
    class: capitaliseFirstLetter(name),
    author: (typeof options.author === 'string' ? options.author : 'mean scaffold')
  };

  console.log('Go to #!/' + name + '/example to see your default page');

  buildDirectoryStructure();
};
