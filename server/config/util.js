'use strict';

var fs = require('fs'),
    path = require('path');

// recursively walk modules path and callback for each file
exports.walk = function(modulesPath, excludeDir, callback) {
    fs.readdirSync(modulesPath).forEach(function(file) {
        var newPath = path.join(modulesPath, file);
        var stat = fs.statSync(newPath);
        if (stat.isFile() && /(.*)\.(js|coffee)$/.test(file)) {
            callback(newPath);
        } else if (stat.isDirectory() && file !== excludeDir) {
            exports.walk(newPath, excludeDir, callback);
        }
    });
};
