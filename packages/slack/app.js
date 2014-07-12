'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Slack = new Module('slack');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Slack.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Slack.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Slack.menus.add({
        title: 'Slacks Dashboard',
        link: 'Slacks Dashboard',
        roles: ['authenticated'],
        menu: 'main'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Slack.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });
*/
    // Another save settings example this time with no callback
    // This writes over the last settings.
/* ------>
    Slack.settings({
        'otherSettings': 'some value'
    });
<------- */ 
/*
    // Get settings. Retrieves latest saved settigns
    Slack.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Slack;
});
