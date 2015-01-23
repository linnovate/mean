'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Comments = new Module('comments');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Comments.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Comments.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Comments.menus.add({
    title: 'comments example page',
    link: 'comments example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Comments.aggregateAsset('css', 'comments.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Comments.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Comments.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Comments.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Comments;
});
