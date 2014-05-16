'use strict';

var fs = require('fs'),
    path = require('path');

// recursively walk modules path and callback for each file
function walk(wpath, type, excludeDir, callback) {
    wpath = path.join(wpath, type);
    if (!fs.existsSync(wpath)) return;

    fs.readdirSync(wpath).forEach(function(file) {
        var newPath = path.join(wpath, file);
        var stat = fs.statSync(newPath);
        if (stat.isFile() && /(.*)\.(js|coffee)$/.test(file)) {
            callback(newPath);
        } else if (stat.isDirectory() && file !== excludeDir) {
            walk(newPath, type, excludeDir, callback);
        }
    });
}
exports.walk = walk;
