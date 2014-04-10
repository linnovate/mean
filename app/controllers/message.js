'use strict';

var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    GroupMessage = mongoose.model('GroupMessage'),
    CompanyGroup = mongoose.model('CompanyGroup');



//返回公司动态消息的所有数据,待前台调用
exports.getCompanyMessage = function(req, res) {

  var cid = req.params.cid;//根据公司id取出该公司的动态消息(公司id是参数传进来的)

  //公司的动态消息都归在虚拟组里
  GroupMessage.find({'poster.cid' : cid , 'group.gid[0]' : 0}, function(err, group_messages) {
    if (err) {
      console.log(err);
      return res.status(404).send([]);
    } else {
      return res.render('partials/groupMessage_list',
        {title: '企业动态消息',
          group_messages: group_messages
      });
    }
  });

};


//返回小组动态消息
exports.getGroupMessage = function(req, res) {

  var cid = req.params.cid;//根据公司id取出该公司的所有活动(公司id是参数传进来的)
  var gid = req.params.gid;//必须是数字类型哦,必要的时候要用parseInt()转换

  //有包含gid的消息都列出来
  GroupMessage.find({'poster.cid' : cid, 'gid' : {'$all':[gid]}}, function(err, group_messages) {
    if (err) {
      console.log(err);
      return res.status(404).send([]);
    } else {
      return res.render('partials/groupMessage_list',
        {title: '小组动态消息',
          group_messages: group_messages
      });
    }
  });
};





//返回系统消息,待定