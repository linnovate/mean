'use strict';

var mean = require('meanio');

exports.get = function(req, res, next) {

	var roles = req.user ? JSON.parse(JSON.stringify(req.user.roles)) : ['anonymous'];
	if (roles.indexOf('admin') !== -1) roles.splice(roles.indexOf('admin'), 1);
	var defaultMenu = req.query.defaultMenu || [];


	if (!Array.isArray(defaultMenu)) defaultMenu = [defaultMenu];

	var items = mean.menus.get({
		roles: roles,
		defaultMenu: defaultMenu.map(function(item) {
			return JSON.parse(item);
		})
	});

	req.menus = items;
	next();
};