
module.exports = function() {
	mean.register('four04', function (app) {	  	 	 
	  return function (req,res,next) {
	  	res.send(404,req.url)
	  };
	});

	mean.ready({name:'four04',id:module.id,loaded:module.loaded});
}



