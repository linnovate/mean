'use strict';

var mean = require('meanio');

module.exports = function (app) {

    app.route('/admin/menu/:name')
        .get(function (req, res) {
            var roles = (req.user ? req.user.roles : ['anonymous']);
            var menu = req.params.name ? req.params.name : 'main';
            var defaultMenu = (req.query.defaultMenu ? req.query.defaultMenu : []);

            if (Object.prototype.toString.call(defaultMenu) === '[object Array]') {
                defaultMenu.forEach(function (item, index) {
                    defaultMenu[index] = JSON.parse(item);
                });
            } else {
                var temp = [];
                temp.push(JSON.parse(defaultMenu));
                defaultMenu = temp;
            }

            var items = mean.menus.get({
                roles: roles,
                menu: menu,
                defaultMenu: defaultMenu
            });

            res.jsonp(items);
        });

};
