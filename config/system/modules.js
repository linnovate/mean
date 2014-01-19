
var EventEmitter = require('events').EventEmitter;

mean = module.parent.exports.mean;
mean.events = new EventEmitter();
mean.modules = [];
mean.ready = function (data) {
	mean.modules.push(data)
  return mean.events.emit('ready', data);
}

module.exports = function(app) {
	//catch when module is ready
	mean.events.on('ready', ready);
	
	var fs = require('fs');
	fs.readdir(process.cwd() + '/modules', function (err,files) {
		if (err) console.log(err);

		remaining = files.length;

		files.forEach(function(file){
			fs.readFile(process.cwd() + '/modules/'+file+'/package.json', function (fileErr, data) {
			  if (err) throw fileErr;			  
			  var json = JSON.parse(data.toString());
			  require(process.cwd() + '/modules/'+file+'/app.js')();
			});
		});
	});
}

function ready(data) {
	remaining--;
	if (!remaining) resolve();
}

function resolve() {	
	mean.modules.forEach(function(module) {		
		mean.resolve.apply(this, [module.name]);
		module = mean.get(module.name);		
	});	
}
