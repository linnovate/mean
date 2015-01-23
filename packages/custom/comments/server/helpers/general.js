/**
 * A generic helper module
 */
var errors = {
  forbidden: 401,
  general: 500,
  notFound: 403
};


/**
 * Apply authentication requirement as middleware
 * @param  {Object}   req  The request object
 * @param  {Object}   res  The response object
 * @param  {Function} next The function to call to proceed with the middleware stack
 * @return {Void}
 */
module.exports.restrictedAccess = function(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(errors.forbidden).json({
      error: 'Admin access needed'
    });
  }
  next();
};

/**
 * Process any error by output to response
 * @param  {Object} err The error object
 * @param  {Object} res The response object
 * @return {Void}
 */
module.exports.processError = function(err, res) {
  return res.status(errors.general).json({
    error: err.message
  });
};

/**
 * A simple method to check if logged in and is admin
 * @return {Boolean}
 */
module.exports.isAdmin = function(user) {
  if (user && user.isAdmin) {
    return true;
  }
  return false;
};