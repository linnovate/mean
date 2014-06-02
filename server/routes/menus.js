'use strict';

var mean = require('meanio'),
    _ = require('lodash');
    
module.exports = function(app) {

    app.route('/admin/menu/:name')
        .get(function(req, res) {
            var roles = (req.user ? req.user.roles : ['anonymous']);
            var menu = req.params.name ? req.params.name : 'main';
            var defaultMenu = (req.query.defaultMenu ? req.query.defaultMenu : []);

            defaultMenu.forEach(function(item, index) {
                defaultMenu[index] = JSON.parse(item);
            });

            var items = mean.menus.get({
                roles: roles,
                menu: menu,
                defaultMenu: defaultMenu
            });

            if(~roles.indexOf('admin')){
                items = _.where(items,{ 'roles': ['admin'] });
            }
            
            res.jsonp(items);
        });

};
