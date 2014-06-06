'use strict';

var fs = require('fs'),
    path = require('path');

var baseRgx = /(.*).(js|coffee)$/;

// recursively walk modules path and callback for each file
function walk(wpath, type, excludeDir, callback) {
    // slice type
    var stype = type.slice(-1) === 's' ? type.slice(0, -1) : type;
    var rgx = new RegExp('(.*)-' + stype + '.(js|coffee)$', 'i');
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
