'use strict';

var comments = require('../controllers/comments');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Comments, app, auth, database) {
  var moduleName = Comments.name;
  var prefix = '/' + moduleName;

  /**
   * A helper function for redundant routing
   * @param  {String} action The action to be appended to the current endpoint
   * @return {Object}        The route object
   */
  var endPoint = function(action) {
    if (action) {
      return app.route(prefix + '/' + action);
    } else {
      return app.route(prefix);
    }
  };

  /**
   * Create a new comment
   */
  endPoint()
  .post(comments.create);

  /**
   * Get list of all comments for a specific article
   */
  endPoint('list/:article')
  .get(comments.list);
};
