'use strict';
var Grid = require('gridfs-stream');

// The Package is passed automatically as first parameter
module.exports = function(Admin, app, auth, database, circles) {
    var gfs = new Grid(database.connection.connections[0].db, database.connection.mongo);
    var mean = require('meanio');
    var requiresAdmin = circles.controller.hasCircle('admin');

    //Setting up the users api
    var users = require('../controllers/users');
    app.get('/api/admin/users', requiresAdmin, users.all);
    app.post('/api/admin/users', requiresAdmin, users.create);
    app.put('/api/admin/users/:userId', requiresAdmin, users.update);
    app.delete('/api/admin/users/:userId', requiresAdmin, users.destroy);

    //Setting up the themes api
    var themes = require('../controllers/themes');
    app.get('/api/admin/themes', requiresAdmin, function(req, res) {
        themes.save(req, res, gfs);
    });

    app.get('/api/admin/themes/defaultTheme', requiresAdmin, function(req, res) {
        themes.defaultTheme(req, res, gfs);
    });

    app.get('/api/admin/modules', requiresAdmin, function(req, res) {
	    //var modules = mean.exportable_modules_list;
	    //res.jsonp(modules);
	    //for (var index in mean.resolved) {
		 //   //console.log(mean.resolved);
		 //   if (mean.resolved[index].result) console.log(mean.resolved[index].result.loadedmodule);
	    //}
    });

    var settings = require('../controllers/settings');
    app.get('/api/admin/settings', requiresAdmin, settings.get);
    app.put('/api/admin/settings', requiresAdmin, settings.save);

	var moduleSettings = require('../controllers/module-settings');
	app.get('/api/admin/moduleSettings/:name', requiresAdmin, moduleSettings.get);
	app.post('/api/admin/moduleSettings/:name', requiresAdmin, moduleSettings.save);
	app.put('/api/admin/moduleSettings/:name', requiresAdmin, moduleSettings.update);

};
