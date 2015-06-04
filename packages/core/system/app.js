'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
    Module = mean.Module,
    config = mean.loadConfig,
    favicon = require('serve-favicon'),
    SystemPackage = new Module('system');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
SystemPackage.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  SystemPackage.routes(app, auth, database);

  SystemPackage.aggregateAsset('css', 'common.css');
  SystemPackage.angularDependencies(['ui.router', 'mean-factory-interceptor']);

  // The middleware in config/express will run before this code

  // Set views path, template engine and default layout
  var viewsPath = (config.cssFramework === 'material') ? __dirname + '../../server/views' : __dirname + '/server/views';
  app.set('views', viewsPath);


  // Setting the favicon and static folder
  app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));

  // Adding robots and humans txt
  app.useStatic(__dirname + '/public/assets/static');

  SystemPackage.menus.add({
    title: 'Log Out',
    link: 'Log Out',
    roles: ['authenticated'],
    menu: 'account'
  });
  

  return SystemPackage;

});
