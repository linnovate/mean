'use strict';

var mean = require('meanio');

exports.render = function(req, res) {

	var modules = [];

	// Preparing angular modules list with dependencies

	var mod2 = (mean.version ? mean.version > '0.3.17' : false);

	// The old version of modules does not support this
	// This allows working with old and new versions of meanio
	if (mod2) {
		for (var name in mean.modules) {
			modules.push({
				name: name,
				module: 'mean.' + name,
				angularDependencies: mean.modules[name].angularDependencies
			});
		};
	}

	// Send some basic starting info to the view
	res.render('index', {
		user: req.user ? JSON.stringify(req.user.name) : 'null',
		roles: req.user ? JSON.stringify(req.user.roles) : JSON.stringify(['annonymous']),
		modules: JSON.stringify(modules)
	});
};