'use strict';

/*
 * Defining the Package
 */
var meanio = require('meanio');
var Module = meanio.Module,
  config = meanio.loadConfig(),
  favicon = require('serve-favicon');

var SystemPackage = new Module('system');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
SystemPackage.register(function(app, auth, database, circles) {

  //We enable routing. By default the Package Object is passed to the routes
  SystemPackage.routes(app, auth, database);

  SystemPackage.aggregateAsset('css', 'common.css');
  SystemPackage.angularDependencies(['mean-factory-interceptor']);
  

  // The middleware in config/express will run before this code

  // Set views path, template engine and default layout
  app.set('views', __dirname + '/server/views');

  // Setting the favicon and static folder
  if(config.favicon) {
    app.use(favicon(config.favicon));
  } else {
    app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));
  }

  // Adding robots and humans txt
  app.useStatic(__dirname + '/public/assets/static');

  return SystemPackage;

});
