'use strict';

var mean = require('meanio');

exports.render = function(req, res) {
    
    var modules = [];
    var roles = (req.user ? req.user.roles : []);

    var enableAdmin = false;
    // Preparing angular modules list with dependencies
    for (var name in mean.modules) {

        if (name === 'mean-admin' && roles.indexOf('admin') != -1) {
            enableAdmin = true;
        }

        modules.push({
            name: name,
            module: 'mean.' + name,
            angularDependencies: mean.modules[name].angularDependencies
        });
    }

    // Send some basic starting info to the view
    res.render('index', {
        user: req.user ? {
            name: req.user.name,
            _id: req.user._id,
            username: req.user.username,
            roles: roles
        } : 'null',
        modules: modules,
        enableAdmin:enableAdmin,
        authenticated: roles
    });
};