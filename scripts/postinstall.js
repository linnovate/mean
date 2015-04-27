'use strict';

var shell = require('shelljs');

if (!shell.which('mean')) return missingMean();

shell.exec('mean postinstall', function(code) {});

function missingMean() {
	console.log('you need to install preferences to packages by yourself,  press enter to continue');
	process.stdin.resume();
	process.stdin.on('data', function (text) {
		process.exit();
	});
}



