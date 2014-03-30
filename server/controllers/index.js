'use strict';

exports.render = function(req, res) {
	res.render('index', {
		user: req.user ? JSON.stringify(req.user.name) : 'null',
		roles: req.user ? JSON.stringify(req.user.roles) : JSON.stringify(['annonymous'])
	});
};