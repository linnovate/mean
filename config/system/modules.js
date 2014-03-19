//Alternative way to access mean from child
//We dont actually have to pass mean object along
//var mean = module.parent.exports.mean;
var fs = require('fs');
var express = require('express');


module.exports = function(mean, app, auth, database, events) {
	mean.modules = [];

	mean.middleware = {
		before: [],
		after: []
	};
	mean.aggregated = {
		js: '',
		css: ''
	};

	findMeanModules();
	enableMeanModules();
	aggregateJs();

	app.get('/modules/aggregated.js', function(req, res, next) {
		res.setHeader('content-type', 'text/javascript');
		res.send(mean.aggregated.js);
	});

	function findMeanModules() {
		var modules = [];
		fs.exists(process.cwd() + '/node_modules', function(exists) {
			if (exists) {
				fs.readdir(process.cwd() + '/node_modules', function(err, files) {
					if (err) console.log(err);
					if (!files) files = [];
					files.forEach(function(file, index) {
						fs.readFile(process.cwd() + '/node_modules/' + file + '/package.json', function(fileErr, data) {
							if (err) throw fileErr;
							if (data) {
								var json = JSON.parse(data.toString());
								if (json.mean) {
									mean.modules.push({
										name: json.name,
										version: json.version
									});
								}
							}
							if (files.length - 1 == index) mean.events.emit('enableMeanModules');
						});
					});
				});
			}
		})
	}

	function enableMeanModules() {
		mean.events.on('enableMeanModules', function() {

			mean.modules.forEach(function(module, index) {
				require(process.cwd() + '/node_modules/' + module.name + '/app.js')(mean);
			});

			mean.modules.forEach(function(module) {
				mean.resolve.apply(this, [module.name]);
				mean.get(module.name);
			});

			return mean.modules;
		});

	}

	function aggregateJs() {
		mean.aggregated.js = '';
		mean.events.on('enableMeanModules', function() {
			var files = ['config', 'services', 'controllers']
			mean.modules.forEach(function(module, index) {
				readFiles(process.cwd() + '/node_modules/' + module.name + '/public/js/');

				function readFiles(path) {
					fs.exists(path, function(exists) {
						if (exists) {
							fs.readdir(path, function(err, files) {
								files.forEach(function(file) {
									fs.readFile(path + file, function(fileErr, data) {
										if (err) throw fileErr;

										if (!data) {
											readFiles(path + file + '/');
										} else {
											mean.aggregated.js += '(function(){' + data.toString() + '})();';
										}
									});
								})
							});
						}
					});
				}
			});
		});
	}

}