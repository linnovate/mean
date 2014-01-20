'use strict';

module.exports = function(mean) {

	/*
		Register the unique module name and indicate its dependencies
	*/

	mean.register('example', function(app, auth, database, middleware) {
		var example = {};

		//add some middlware BEFORE the routes are initialized
		//heavy weight so it will be one of the last to be evaluated
		middleware.add('before', 1, function(req, res, next) {
			//just make a random counter as a demo
			req.example = 'First';
			next();
		});

		middleware.add('before', 3, function(req, res, next) {
			req.example += ' Second';
			next();
		});

		//add some middlware AFTER the routes are initialized
		//heavy weight so it will be one of the last to be evaluated
		middleware.add('after', 999, function(req, res) {
			//Just an example so lets just do something random
			//like add ! to error message
			res.status(404).render('404', {
				url: req.originalUrl,
				error: 'Not found!'
			});
		});

		//example that uses the database
		app.get('/example', function(req, res) {
			res.send('Some example');
		});

		//example checking for authorization
		app.get('/example/auth', auth.requiresLogin, function(req, res) {
			var Article = database.connection.model('Article');
			Article.findOne({}, function(err, article) {
				res.jsonp(article);
			});
		});

		//add a function that can be used by other modules
		example.articles = function articles(callback) {
			var Article = database.connection.model('Article');
			Article.find({}, function(err, articles) {
				callback(articles);
			});
		};

		return example;
	});

	mean.ready({
		name: 'example',
		id: module.id,
		loaded: module.loaded
	});
};