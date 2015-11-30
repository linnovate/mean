'use strict';

var mean = require('meanio');

module.exports = function(System, app, auth, database) {

    app.route('/api/admin/menu/:name')
        .get(function(req, res) {
            var roles = req.user ? JSON.parse(JSON.stringify(req.acl.user.allowed)) : ['anonymous'],
            menu = req.params.name || 'main',
            defaultMenu = req.query.defaultMenu || [],
            itemsRes = [],
            tmpMenu;

            if (menu === 'main' && roles.indexOf('admin') !== -1) {
                roles.splice(roles.indexOf('admin'), 1);
            } else if (menu === 'modules') {
                menu = 'main';
                tmpMenu = 'modules';
            }


            if (!Array.isArray(defaultMenu)) defaultMenu = [defaultMenu];

            var items = mean.menus.get({
                roles: roles,
                menu: menu,
                defaultMenu: defaultMenu.map(function(item) {
                    return JSON.parse(item);
                })
            });

            if (menu !== 'main') return res.json(items);


            items.forEach(function(item) {
                if (tmpMenu && tmpMenu === 'modules' && item.roles.indexOf('admin') > -1) itemsRes.push(item);
                else if (!tmpMenu && menu === 'main' && item.roles.indexOf('admin') < 0) itemsRes.push(item);
            });

            res.json(itemsRes);

        });
};
