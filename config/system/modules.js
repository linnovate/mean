var EventEmitter = require('events').EventEmitter;
var mean = module.parent.exports.mean;

mean.events = new EventEmitter();

// Middleware for adding chained function before or after routes
require('./chainware')(mean);

// We have events such as ready for modules to use
require('./events')(mean);

module.exports = function() {
	//catch when module is ready
	mean.events.on('ready', ready);

	//read the file structure
	var fs = require('fs');
	fs.readdir(process.cwd() + '/modules', function(err, files) {
		if (err) console.log(err);
		remaining = files.length;
		files.forEach(function(file) {
			fs.readFile(process.cwd() + '/modules/' + file + '/package.json', function(fileErr, data) {
				if (err) throw fileErr;
				var json = JSON.parse(data.toString());
				require(process.cwd() + '/modules/' + file + '/app.js')(mean);
			});
		});
	});
}

// Process the ready event. Will expand this in due course
function ready(data) {
	remaining--;
	if (!remaining) resolve();
}

// Resolve the dependencies once all modules are ready
function resolve() {
	mean.modules.forEach(function(module) {
		mean.resolve.apply(this, [module.name]);
		mean.get(module.name);
	});
}