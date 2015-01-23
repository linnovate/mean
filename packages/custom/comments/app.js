'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Comments = new Module('comments');

/*
 * Registering the comments module
 */
Comments.register(function(app, auth, database) {
  //We enable routing. By default the Package Object is passed to the routes
  Comments.routes(app, auth, database);
  Comments.aggregateAsset('css', 'comments.css');
  return Comments;
});
