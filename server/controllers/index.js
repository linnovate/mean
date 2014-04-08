'use strict';

var mean = require('meanio');

exports.render = function(req, res) {

	var modules = [];

	// Preparing angular modules list with dependencies

	for (var name in mean.modules) {
		modules.push({
			name: name,
			module: 'mean.' + name,
			angularDependencies: mean.modules[name].angularDependencies
		});
	};


	// Send some basic starting info to the view
	res.render('index', {
		user: req.user ? JSON.stringify(req.user.name) : 'null',
		roles: req.user ? JSON.stringify(req.user.roles) : JSON.stringify(['annonymous']),
		modules: JSON.stringify(modules)
	});
};