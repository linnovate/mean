'use strict';

// group routes use group controller
var group = require('../controllers/group');

var group_manager = require('../controllers/manager/groupManager');

module.exports = function(app) {
    app.get('/group/getgroups',group.getGroups);
    app.get('/group/savegroups',group.saveGroups);


    app.get('/group/groupmanager',group_manager.groupManager);
};
