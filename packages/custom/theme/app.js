'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Theme = new Module('theme');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Theme.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Theme.routes(app, auth, database);

  Theme.aggregateAsset('css', 'loginForms.css');
  Theme.aggregateAsset('css', 'theme.css');
  Theme.angularDependencies(['mean.system']);

  return Theme;
});
