//动态消息路由
'use strict';


var message = require('../controllers/message');

module.exports = function(app) {
  //获取小组动态列表
  app.get('/group/groupMessage', message.getGroupMessage);
  //获取企业动态列表
  app.get('/company/groupMessage', message.getCompanyMessage);
}