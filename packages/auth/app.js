'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
	Module = mean.Module,
	passport = require('passport');

var Auth = new Module('Auth');

Auth.register(function(database) {

	// Register auth dependency

	var auth = require('./server/config/authorization');
	require('./server/config/passport')(passport);

	Auth.passport = passport;
	Auth.auth = auth;
	return Auth;
});
