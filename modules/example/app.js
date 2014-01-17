
module.exports = function() {
	mean.register('cms', function (app, database) {
	  var cms  = {};  
	  
	  app.get('/yonatan', function (req,res,next) {
	  	var Article = database.connection.model('Article');
	    Article.find({},function(err,articles) {
	    	res.jsonp(articles);
	    })
	  });

	  cms.articles = function articles(callback) {
	    var Article = database.connection.model('Article');
	    Article.find({},function(err,articles) {
	    	callback(articles);
	    })
	  };

	  cms.articles(function (articles) {
	  	console.log(articles)
	  });

	  return cms;
	});

	mean.ready({name:'cms',id:module.id,loaded:module.loaded});
}



