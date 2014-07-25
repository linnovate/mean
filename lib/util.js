'use strict';

var fs = require('fs'),
  _ = require('lodash'),
  glob = require('glob'),
  path = require('path');

var baseRgx = /(.*).(js|coffee)$/;

// recursively walk modules path and callback for each file
function walk(wpath, type, excludeDir, callback) {
  // regex - any chars, then dash type, 's' is optional, with .js or .coffee extension, case-insensitive
  // e.g. articles-MODEL.js or mypackage-routes.coffee
  var rgx = new RegExp('(.*)-' + type + '(s?).(js|coffee)$', 'i');
  if (!fs.existsSync(wpath)) return;
  fs.readdirSync(wpath).forEach(function(file) {
    var newPath = path.join(wpath, file);
    var stat = fs.statSync(newPath);
    if (stat.isFile() && (rgx.test(file) || (baseRgx.test(file)) && ~newPath.indexOf(type))) {
      // if (!rgx.test(file)) console.log('  Consider updating filename:', newPath);
      callback(newPath);
    } else if (stat.isDirectory() && file !== excludeDir && ~newPath.indexOf(type)) {
      walk(newPath, type, excludeDir, callback);
    }
  });
}

// ability to preload requirements for tests
function preload(gpath, type) {
  glob.sync(gpath).forEach(function(file) {
    walk(file, type, null, require);
  });
}

function loadConfig() {
  // Load configurations
  // Set the node environment variable if not set before
  var configPath = process.cwd() + '/config/env';
  process.env.NODE_ENV = ~fs.readdirSync(configPath).map(function(file) {
    return file.slice(0, -3);
  }).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

  // Extend the base configuration in all.js with environment
  // specific configuration
  return _.extend(
    require(configPath + '/all'),
    require(configPath + '/' + process.env.NODE_ENV) || {}
  );
}

JSON.flatten = function(data, options) {
  var result = {};
  flatten(data, '');

  function flatten(config, root) {
    for (var index in config) {
      if (config[index] && !config[index].value && typeof(config[index]) === 'object') {
        flatten(config[index], layerRoot(root, index));
      } else {
        result[layerRoot(root, index)] = {
          'value': config[index]
        };

        if (options['default']) {
          result[layerRoot(root, index)]['default'] = config[index];
        }
      }
    }
  }

  function layerRoot(root, layer) {
    return (root ? root + '.' : '') + layer;
  }
  return result;
};

JSON.unflatten = function(data) {
  if (Object(data) !== data || Array.isArray(data))
    return data;
  var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    resultholder = {};
  for (var p in data) {
    var cur = resultholder,
      prop = '',
      m;
    while ((m = regex.exec(p))) {
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return resultholder[''] || resultholder;
};

exports.walk = walk;
exports.preload = preload;
exports.loadConfig = loadConfig;
