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
	}

	// Send some basic starting info to the view
	res.render('index', {
		user: req.user ? JSON.stringify({
			name: req.user.name,
			_id:req.user._id,
			username: req.user.username,
			roles: (req.user ? req.user.roles : ['anonymous'])
		}) : 'null',
		modules: JSON.stringify(modules)
	});
};
