
module.exports = function() {
	mean.register('example', function (app, auth, database) {
	  var example  = {};  
	  
	  //example checking for authorization
	  app.get('/example/auth',auth.requiresLogin, function (req,res,next) {
	  	var Article = database.connection.model('Article');
	    Article.find({},function(err,articles) {
	    	res.jsonp(articles);
	    })
	  });

	  //example that uses the database
		app.get('/example', function (req,res,next) {
	  	var Article = database.connection.model('Article');
	    Article.find({},function(err,articles) {
	    	res.jsonp(articles);
	    })
	  });

		//add a function that can be used by other modules
	  example.articles = function articles(callback) {
	    var Article = database.connection.model('Article');
	    Article.find({},function(err,articles) {
	    	callback(articles);
	    })
	  };

	  return example;
	});

	mean.ready({name:'example',id:module.id,loaded:module.loaded});
}



