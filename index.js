var meanVersion = require(process.cwd() + '/package.json').version;

if (meanVersion < '0.3.2') {
	if (meanVersion === '0.3.1')
		module.exports = require('./lib/mean0.3.1');
	else
		module.exports = require('./lib/mean0.3.0');
} else {
	// current version
	module.exports = require('./lib/mean');
}
