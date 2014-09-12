'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var __class__ = new Module('__pkgName__');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
__class__.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  __class__.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  __class__.menus.add({
    title: '__name__ example page',
    link: '__name__ example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  __class__.aggregateAsset('css', '__name__.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    __class__.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    __class__.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    __class__.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return __class__;
});
