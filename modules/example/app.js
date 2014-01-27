'use strict';

module.exports = function(mean) {

	/*
		Register the unique module name and indicate its dependencies
	*/

	mean.register('404', function(app, auth, database, middleware) {

		//add some middlware AFTER the routes are initialized
		//heavy weight so it will be one of the last to be evaluated
		middleware.add('after', 999, function(req, res) {
			//Just an example so lets just do something random
			//like add ! to error message
			res.status(404).render('404/index', {
				url: req.originalUrl,
				error: 'Not found!'
			});
		});
	});

	mean.ready({
		name: '404',
	});
};