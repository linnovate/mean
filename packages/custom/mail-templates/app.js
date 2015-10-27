'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var MailTemplates = new Module('mail-templates');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
MailTemplates.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  MailTemplates.routes(app, auth, database);

  MailTemplates.aggregateAsset('css', 'mailTemplates.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    MailTemplates.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    MailTemplates.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    MailTemplates.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return MailTemplates;
});
