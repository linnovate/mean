'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var Admin = new Module('admin');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */

Admin.register(function(app, auth, database) {

	Admin.menus.add({
		title: 'admin example',
		link: 'admin example',
		roles: ['admin'],
		menu: 'main'
	});

    Admin.aggregateAsset('css', 'admin.css');
    Admin.aggregateAsset('js', '../lib/ng-clip/src/ngClip.js', {
        absolute: false,
        global: true
    });

    Admin.aggregateAsset('js', '../lib/zeroclipboard/dist/ZeroClipboard.js', {
        absolute: false,
        global: true
    });

    Admin.angularDependencies(['ngClipboard']);

    // We enable routing. By default the Package Object is passed to the routes
    Admin.routes(app, auth, database);
    return Admin;
});
