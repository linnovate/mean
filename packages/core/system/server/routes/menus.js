'use strict';

var mean = require('meanio');

module.exports = function(System, app, auth, database) {

  app.route('/api/admin/menu/:name')
    .get(function(req, res) {
      var roles = req.user ? JSON.parse(JSON.stringify(req.user.roles)) : ['anonymous'];
      var menu = req.params.name || 'main';
      var defaultMenu = req.query.defaultMenu || [];

      if (menu === 'main' && roles.indexOf('admin') !== -1) {
            roles.splice(roles.indexOf('admin'), 1);
      } else if (menu === 'modules') menu = 'main';


      if (!Array.isArray(defaultMenu)) defaultMenu = [defaultMenu];

      var items = mean.menus.get({
        roles: roles,
        menu: menu,
        defaultMenu: defaultMenu.map(function(item) {
          return JSON.parse(item);
        })
      });

	  res.json(items);

    });
};
