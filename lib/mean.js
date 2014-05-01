'use strict';

var swig = require('swig');
var container = require('dependable').container();
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

var events = new EventEmitter();
var modules = [];
var menus;
var allMenus = [];
var middleware = {
	before: {},
	after: {}
};
var aggregated = {
	js: '',
	css: ''
};

function Meanio() {
	if (this.active) return;
	this.events = events;
}

Meanio.prototype.app = function(name, options) {
	if (this.active) return this;
	findModules();
	enableModules();
	aggregate('js', null);

	this.name = name;
	this.active = true;
	this.options = options;
	menus = new this.Menus();
	this.menus = menus;
	return this;
};

Meanio.prototype.status = function() {
	return {
		active: this.active,
		name: this.name
	};
};

Meanio.prototype.register = container.register;

Meanio.prototype.resolve = container.resolve;

//confusing names, need to be refactored asap
Meanio.prototype.load = container.get;

Meanio.prototype.modules = modules;

Meanio.prototype.aggregated = aggregated;

Meanio.prototype.Menus = function(name) {
	this.add = function(options) {

		//console.log(allMenus[options.menu])

		options.menu = (options.menu ? options.menu : 'main');
		options.roles = (options.roles ? options.roles : ['anonymous']);

		if (allMenus[options.menu]) {
			allMenus[options.menu].push({
				roles: options.roles,
				title: options.title,
				link: options.link
			});
		} else {
			allMenus[options.menu] = [{
				roles: options.roles,
				title: options.title,
				link: options.link
			}];
		}
	};

	this.get = function(options) {
		var allowed = [];
		options.roles = (options.roles ? options.roles : ['anonymous']);
		options.menu = (options.menu ? options.menu : 'main');

		if (!allMenus[options.menu] && !options.defaultMenu) return [];

		var items = options.defaultMenu.concat((allMenus[options.menu] ? allMenus[options.menu] : []));

		items.forEach(function(item) {

			var hasRole = false;
			options.roles.forEach(function(role) {
				if (role == 'admin' || item.roles.indexOf('anonymous') != -1 || item.roles.indexOf(role) != -1) {
					hasRole = true;
				}
			});

			if (hasRole) {
				allowed.push(item);
			}
		});
		return allowed;
	};
};

Meanio.prototype.Module = function(name) {
	this.name = name.toLowerCase();
	this.menus = menus;
	this.render = function(view, options, callback) {
		swig.renderFile(modulePath(this.name) + '/server/views/' + view + '.html', options, callback);
	};

	this.routes = function() {
		var args = Array.prototype.slice.call(arguments);
		require(modulePath(this.name) + '/server/routes').apply(this, [this].concat(args));
	};

	this.aggregateJs = function(path) {
		aggregate('js', this.name + '/public/' + path);
	};
	this.aggregateCss = function(path) {
		aggregate('css', this.name + '/public/assets/css/' + path);
	};

	this.register = function(callback) {
		container.register(capitaliseFirstLetter(name), callback);
	};

	this.settings = function() {

		if (!arguments.length) return;

		var database = container.get('database');

		if (!database || !database.connection) {
			return {
				err: true,
				message: "No database connection"
			};
		}
		var Package = database.connection.model('Package');
		if (arguments.length == 2) return updateSettings(this.name, arguments[0], arguments[1]);
		if (arguments.length == 1 && typeof arguments[0] == 'object') return updateSettings(this.name, arguments[0], function() {});
		if (arguments.length == 1 && typeof arguments[0] == 'function') return getSettings(this.name, arguments[0]);

		function updateSettings(name, settings, callback) {
			Package.findOneAndUpdate({
				name: name
			}, {
				$set: {
					settings: settings,
					updated: new Date()
				}
			}, {
				upsert: true,
				multi: false
			}, function(err, doc) {
				if (err) {
					console.log(err);
					return callback(true, 'Failed to update settings');
				}
				return callback(null, doc);
			});
		}

		function getSettings(name, callback) {
			Package.findOne({
				name: name
			}, function(err, doc) {
				if (err) {
					console.log(err);
					return callback(true, 'Failed to retrieve settings');
				}
				return callback(null, doc);
			});
		}
	};
};

function modulePath(name) {
	return process.cwd() + '/node_modules/' + name;
}

function findModules() {
	fs.exists(process.cwd() + '/node_modules', function(exists) {
		if (exists) {
			fs.readdir(process.cwd() + '/node_modules', function(err, files) {
				if (err) console.log(err);
				if (!files) files = [];
				files.forEach(function(file, index) {
					fs.readFile(process.cwd() + '/node_modules/' + file + '/package.json', function(fileErr, data) {
						if (err) throw fileErr;
						if (data) {
							//Add some protection here
							var json = JSON.parse(data.toString());
							if (json.mean) {
								modules.push({
									name: json.name,
									version: json.version
								});
							}
						}
						if (files.length - 1 == index) events.emit('modulesFound');
					});
				});
			});
		}
	});
}

function enableModules() {
	events.on('modulesFound', function() {
		
		var database = container.get('database');
		
		// Load the package module for mongoose
		require('../modules/package')(database);

		modules.forEach(function(module, index) {
			//add warnings
			require(process.cwd() + '/node_modules/' + module.name + '/app.js');
		});

		modules.forEach(function(module) {
			var name = capitaliseFirstLetter(module.name);
			container.resolve.apply(this, [name]);
			container.get(name);
		});

		return modules;
	});
}

//will do compressiona and mingify/uglify soon
function aggregate(ext, path) {
	//Allow libs
	var libs = true;
	if (path) return readFile(ext, process.cwd() + '/node_modules/' + path);

	//this redoes all the aggregation for the extention type
	aggregated[ext] = '';

	//Deny Libs
	libs = false;
	events.on('modulesFound', function() {
		modules.forEach(function(module, index) {
			readFiles(ext, process.cwd() + '/node_modules/' + module.name + '/public/');
		});
	});

	function readFiles(ext, path) {
		fs.exists(path, function(exists) {
			if (exists) {
				fs.readdir(path, function(err, files) {
					files.forEach(function(file) {
						if (!libs && file != 'libs') {
							readFile(ext, path + file);
						}
					});
				});
			}
		});
	}

	function readFile(ext, path) {
		fs.readdir(path, function(err, files) {
			if (files) return readFiles(ext, path + '/');
			if (path.indexOf('.' + ext) !== path.length-ext.length-1) return;
			fs.readFile(path, function(fileErr, data) {
				//add some exists and refactor
				//if (fileErr) console.log(fileErr)

				if (!data) {
					readFiles(ext, path + '/');
				} else {
					aggregated[ext] += (ext == 'js') ? ('(function(){' + data.toString() + '})();') : data.toString() + '\n';
				}
			});
		});
	}
}

Meanio.prototype.chainware = {

	add: function(event, weight, func) {
		middleware[event].splice(weight, 0, {
			weight: weight,
			func: func
		});
		middleware[event].join();
		middleware[event].sort(function(a, b) {
			if (a.weight < b.weight) {
				a.next = b.func;
			} else {
				b.next = a.func;
			}
			return (a.weight - b.weight);
		});
	},

	before: function(req, res, next) {
		if (!middleware.before.length) return next();
		chain('before', 0, req, res, next);
	},

	after: function(req, res, next) {
		if (!middleware.after.length) return next();
		chain('after', 0, req, res, next);
	},

	chain: function(operator, index, req, res, next) {
		var args = [req, res,
			function() {
				if (middleware[operator][index + 1]) {
					chain('before', index + 1, req, res, next);
				} else {
					next();
				}
			}
		];

		middleware[operator][index].func.apply(this, args);
	}
};

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = exports = new Meanio();

