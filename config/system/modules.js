
var EventEmitter = require('events').EventEmitter;

mean = module.parent.exports.mean;
mean.events = new EventEmitter();
mean.modules = [];
mean.middleware = {before:[],after:[]};

//registering a module with basic middlware hooks for submodules

mean.register('middleware' , function(app) {	
	var middleware = {};	

	middleware.add = function (event, weight, func) {	
		mean.middleware[event].splice(weight, 0, {weight:weight,func:func});
 		mean.middleware[event].join();
 		mean.middleware[event].sort(function(a,b) {
 			if (a.weight<b.weight) {				
 				a.next = b.func;
 			} else {
 				b.next = a.func;
 			}
 			return (a.weight - b.weight)
 		});	
	};

	middleware.before = function (req,res,next) {			
		if (!mean.middleware.before.length) return next();
		chain('before', 0, req, res, next);
	};

	middleware.after = function (req,res,next) {					
		if (!mean.middleware.after.length) return next();
		chain('after', 0, req, res, next);
	};

	function chain(operator, index, req, res, next) {
		mean.middleware[operator][index].func(req,res,function(err) {
			if (mean.middleware[operator][index+1]) {
				chain('before', index+1, req, res, next);
			} else {
				next();
			}				
		});	
	}
	return middleware;	
});

mean.resolve('middleware');


//this will be separate file


//event for modules when they are ready. We expose this to the modules
mean.ready = function (data) {	
	mean.modules.push(data)
  return mean.events.emit('ready', data);
}

module.exports = function(app) {
	//catch when module is ready
	mean.events.on('ready', ready);
	
	//read the file structure
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

//process the ready event
function ready(data) {
	remaining--;
	if (!remaining) resolve();
}

//resolve the dependencies once all modules are ready
function resolve() {	
	mean.modules.forEach(function(module) {		
		mean.resolve.apply(this, [module.name]);		
		mean.get(module.name);
	});	
}
