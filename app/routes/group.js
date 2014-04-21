'use strict';

// group routes use group controller
var group = require('../controllers/group');


module.exports = function(app) {
  app.get('/group/getgroups',group.getGroups);

  app.get('/group/getCompanyGroups/:id', group.getCompanyGroups);
  app.get('/group/getCompanyGroups', group.getCompanyGroups);


  app.get('/group/home/:groupId', group.home);
  app.get('/group/home', group.home);

  app.get('/group/info/:groupId', group.info);
  app.get('/group/info', group.info);

  app.post('/group/saveInfo', group.saveInfo);

  app.get('/group/getCampaigns', group.getGroupCampaign);
  app.get('/group/getGroupMessages', group.getGroupMessage);
  app.get('/group/getGroupMembers', group.getGroupMember);

  app.post('/group/campaignCancel', group.campaignCancel);

  app.get('/group/competition', group.competition);
  //小组发布活动
  app.post('/group/campaignSponsor', group.sponsor);
  app.param('groupId',group.group);


  //约战、应战
  app.post('/group/provoke', group.provoke);
  app.post('/group/responseProvoke', group.responseProvoke);
};
