'use strict';

// group routes use group controller
var group = require('../controllers/group');


module.exports = function(app) {
  app.get('/group/getgroups',group.getGroups);
  app.get('/group/savegroups',group.saveGroups);

  app.get('/group/getCompanyGroups/:id', group.getCompanyGroups);
  app.get('/group/getCompanyGroups', group.getCompanyGroups);


  app.get('/group/home/:groupId', group.home);
  app.get('/group/home', group.home);

  app.get('/group/getAccount', group.getAccount);
  app.get('/group/getInfo', group.getInfo);
  app.get('/group/info/:groupId', group.Info);
  app.get('/group/info', group.Info);

  app.post('/group/saveInfo', group.saveInfo);

  app.get('/group/getCampaigns', group.getGroupCampaign);
  app.get('/group/getGroupMessages', group.getGroupMessage);
  app.get('/group/getGroupMembers', group.getGroupMember);

  //小组发布活动
  app.get('/group/campaignSponsor', group.showSponsor);
  app.post('/group/campaignSponsor', group.sponsor);
  app.param('groupId',group.group);
};
