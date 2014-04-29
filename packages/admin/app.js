'use strict';
/*
 * Defining the Package
 */

var Module = require("meanio").Module;

var Admin = new Module("Admin");
var assetmanager = require('assetmanager');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */

Admin.register(function(app, auth, database) {

    Admin.aggregateAsset('css', 'admin.css');
    Admin.aggregateAsset('css', 'themes.css');
    Admin.aggregateAsset('js', 'users.js');
    Admin.aggregateAsset('js', 'themes.js');
    Admin.aggregateAsset('js', 'modules.js');



    //We enable routing. By default the Package Object is passed to the routes
    Admin.routes(app, auth, database);
    return Admin;
});