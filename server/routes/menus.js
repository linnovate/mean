'use strict';

var mean = require('meanio');

module.exports = function(app) {
    app.get('/admin/menu/:name', function(req, res) {
        var roles = (req.user ? req.user.roles : ['annonymous']);
        var menu = req.params.name ? req.params.name : 'main';
        res.jsonp(mean.menus.get({
            roles: roles,
            menu: menu
        }));
    });
};