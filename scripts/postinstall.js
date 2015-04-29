'use strict';

var shell = require('shelljs');

if (!shell.which('mean')) return missingMean();

shell.exec('mean postinstall', function(code) {});

function missingMean() {
	console.log("You're attempting to deploy mean without the mean-cli, the mean post install script traverses through all packages and takes care of their dependencies, please install mean-cli and continue...");
	process.stdin.resume();
	process.stdin.on('data', function (text) {
		process.exit();
	});
}



