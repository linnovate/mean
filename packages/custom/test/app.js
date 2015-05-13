'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Test = new Module('test');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Test.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Test.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Test.menus.add({
    title: 'test example page',
    link: 'test example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Test.aggregateAsset('css', 'test.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Test.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Test.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Test.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Test;
});
