'use strict';

// group routes use group controller
var group = require('../controllers/group');


module.exports = function(app) {
  app.get('/group/getgroups',group.getGroups);
  app.get('/group/savegroups',group.saveGroups);

  app.get('/group/getCompanyGroups/:id', group.getCompanyGroups);
  app.get('/group/getCompanyGroups', group.getCompanyGroups);


  app.get('/group/getAccount', group.getAccount);
  app.get('/group/getInfo', group.getInfo);
  app.get('/group/info/:groupId', group.Info);


  app.post('/group/saveAccount', group.saveAccount);
  app.post('/group/saveInfo', group.saveInfo);


  //小组发布活动
  app.post('/group/campaignSponsor', group.sponsor);
  app.param('groupId',group.group);
};
