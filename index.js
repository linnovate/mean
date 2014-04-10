var meanVersion = require(process.cwd() + '/package.json').version;

if (meanVersion > '0.3.0') {
	switch (meanVersion) {
		case '0.3.1':
			module.exports = require('./lib/mean0.3.1');
			break;
		default:
			module.exports = require('./lib/mean0.3.2');
			break;
	}
} else {
	//all older versions of mean
	module.exports = require('./lib/mean');
}