'use strict';

var fs = require('fs');

// recursively walk path and callback for each file
exports.walk = function(path, excludeDir, callback) {
    fs.readdirSync(path).forEach(function(file) {
	var newPath = path + '/' + file;
	var stat = fs.statSync(newPath);
	if (stat.isFile()) {
	    if (/(.*)\.(js|coffee)$/.test(file)) {
		callback(newPath);
	    }
	} else if (stat.isDirectory() && file !== excludeDir) {
	    exports.walk(newPath);
	}
    });
};
