
module.exports = function(mean) {
	mean.modules = [];
	mean.middleware = {before:[],after:[]};

	//registering a module with basic middlware hooks for submodules

	mean.register('middleware' , function(app) {	
		var middleware = {};	

		middleware.add = function (event, weight, func) {	
			mean.middleware[event].splice(weight, 0, {weight:weight,func:func});
	 		mean.middleware[event].join();
	 		mean.middleware[event].sort(function(a,b) {
	 			if (a.weight<b.weight) {				
	 				a.next = b.func;
	 			} else {
	 				b.next = a.func;
	 			}
	 			return (a.weight - b.weight)
	 		});	
		};

		middleware.before = function (req,res,next) {			
			if (!mean.middleware.before.length) return next();
			chain('before', 0, req, res, next);
		};

		middleware.after = function (req,res,next) {					
			if (!mean.middleware.after.length) return next();
			chain('after', 0, req, res, next);
		};

		function chain(operator, index, req, res, next) {		
			var args = [req,res, function(err) {
				if (mean.middleware[operator][index+1]) {
					chain('before', index+1, req, res, next);
				} else {
					next();
				}				
			}];

			mean.middleware[operator][index].func.apply(this,args);	
		}

		return middleware;	
	});

	mean.resolve('middleware');	
}
