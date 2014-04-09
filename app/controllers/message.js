'use strict';

var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    GroupMessage = mongoose.model('GroupMessage'),
    CompanyGroup = mongoose.model('CompanyGroup');



//返回动态消息待所有数据,待前台调用

/* 还没完成
exports.getMessage = function(req, res) {

  var cid = req.params.cid;
  GroupMessage.find({'poster.cid' : cid}, function(err, groupMessage) {
    if (err) {
      return res.status(404).send([]);
    } else {
      var messages = [];
      for(var i = 0, length = groupMessage.length; i < length; i++) {
        messages.push({
          'id': company_group[i].group.gid,
          'type': company_group[i].group.group_type,
          'member_num':'33',
          'name':'长跑队',
          'score':897,
          'leader':'暂无'
        });
      }
      return res.send(messages);
    }
  });

};
*/