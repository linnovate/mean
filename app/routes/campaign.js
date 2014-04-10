//活动列表路由
'use strict';

var campaign = require('../controllers/campaign');

module.exports = function(app) {
  //获取小组活动列表
  app.get('/group/campaign', campaign.getGroupCampaign);
  //获取企业活动列表
  app.get('/comapny/campaign', campaign.getCompanyCampaign);
}