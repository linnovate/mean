var meanVersion = require(process.cwd() + '/package.json').version;

//temporary measure to allow for some more rapi devlopment without breaking current versions
if (meanVersion > '0.3.0') {
	module.exports = require('./lib/mean0.3.1');
} else {
	module.exports = require('./lib/mean');
}