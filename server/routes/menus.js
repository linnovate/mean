'use strict';

var mean = require('meanio');

module.exports = function(app) {

    app.route('/admin/menu/:name')
        .get(function(req, res) {
            var roles = (req.user ? req.user.roles : ['anonymous']);
            var menu = req.params.name ? req.params.name : 'main';
            var defaultMenu = (req.query.defaultMenu ? req.query.defaultMenu : []);

            defaultMenu.forEach(function(item, index) {
                defaultMenu[index] = JSON.parse(item);
            });

            defaultMenu.push(
                {
                    'roles': ['admin'],
                    'title': 'Users',
                    'link': 'all users'
                },{
                    'roles': ['admin'],
                    'title': 'Create New User',
                    'link': 'create user'
                });


            var items = mean.menus.get({
                roles: roles,
                menu: menu,
                defaultMenu: defaultMenu
            });

            res.jsonp(items);
        });

};
