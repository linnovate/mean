'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Users = new Module('users');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Users.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Users.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Users.menus.add({
        title: 'users example page',
        link: 'users example page',
        roles: ['authenticated'],
        menu: 'main'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Users.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Users.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Users.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Users;
});
