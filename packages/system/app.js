'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module,
    favicon = require('serve-favicon');

var System = new Module('system');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
System.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    System.routes(app, auth, database);

    System.aggregateAsset('css','common.css');

    // Set views path, template engine and default layout
    app.set('views', __dirname + '/server/views');

    // Setting the fav icon and static folder
    app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));
    /*
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    System.settings({
	'someSetting': 'some value'
    }, function(err, settings) {
	//you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    System.settings({
	'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    System.settings(function(err, settings) {
	//you now have the settings object
    });
    */

    return System;
});
