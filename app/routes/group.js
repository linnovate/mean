'use strict';

// group routes use group controller
var group = require('../controllers/group');

module.exports = function(app) {
    app.get('/group/getgroups',group.getGroups);
    app.get('/group/savegroups',group.saveGroups);
  
};
