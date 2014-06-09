'use strict';

var fs = require('fs'),
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
exports.walk = walk;
