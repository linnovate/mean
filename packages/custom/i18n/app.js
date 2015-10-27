'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var I18n = new Module('i18n');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
I18n.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  I18n.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  I18n.menus.add({
    title: 'i18n example page',
    link: 'i18n example page',
    roles: ['authenticated'],
    menu: 'main'
  });

  I18n.aggregateAsset('js', '../lib/i18next/i18next.js', { weight: 1 });
  I18n.aggregateAsset('js', '../lib/ng-i18next/dist/ng-i18next.js', { weight: 2 });

  I18n.angularDependencies(['jm.i18next', 'mean.system']);

  I18n.aggregateAsset('css', 'i18n.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    I18n.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    I18n.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    I18n.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return I18n;
});
