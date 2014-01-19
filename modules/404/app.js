
module.exports = function() {
	mean.register('404', function (app, middleware) {	  	 	 
		//very heavy weight to ensure it is last
		middleware.add('after',999, function(req,res,next) {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found!!!!!!!'
      });
   	})	  
	});

	mean.ready({name:'404',id:module.id,loaded:module.loaded});
}



