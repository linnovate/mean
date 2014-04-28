'use strict';

// The Package is past automatically as first parameter
module.exports = function(Admin, app, auth, database) {
    //Setting up the users api
    var users = require('../controllers/users');
    app.get('/admin/users', auth.requiresAdmin, users.all);
    app.post('/admin/users', auth.requiresAdmin, users.create);
    app.put('/admin/users/:userId', auth.requiresAdmin, users.update);
    app.del('/admin/users/:userId', auth.requiresAdmin, users.destroy);

    //Setting up the users api
    var themes = require('../controllers/themes');
    app.get('/admin/themes', auth.requiresAdmin, themes.save);
    app.get('/themes/default.css', themes.get);
};