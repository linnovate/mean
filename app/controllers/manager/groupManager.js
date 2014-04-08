//小组管理(比如组长发布组内活动,组内成员管理等)
'use strict';

var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    Message = mongoose.model('Message'),
    Campaign = mongoose.model('Campaign'),
    User = mongoose.model('User'),
    Comapny = mogoose.model('Company'),
    config = require('../config/config');


//组长发布一个活动(只能是一个企业)

exports.sponsor = function (req, res) {
  var cid = req.session.cid;  //公司id
  var uid = req.session.uid;  //用户id
  var gid = req.body.gid;  //组件id,注意,这里是数组,因为一个组长可以管理很多组
  var group_type = req.body.group_type; //组件类型,和id一一对应
  var content = req.body.content;//活动内容



  User.findOne({
        id : uid
    },
    function (err, user) {
      if (user) {

        //生成活动
        var campaign = new Campaign();
        campaign.campaign.gid.push(user.gid);
        campaign.campaign.group_type.push(group_type);
        campaign.campaign.cid.push(cid);

        Company.findOne({
            id : cid
          },
          function (err, company) {
            campaign.campaign.cname.push(company.info.name);
        });

        campaign.campaign.poster.cid = cid;
        campaign.campaign.poster.uid = uid;
        campaign.campaign.poster.role = 'LEADER';
        campaign.campaign.poster.realname = user.realname;
        campaign.campaign.poster.username = user.username;

        campaign.create_time = req.body.create_time;
        campaign.start_time = req.body.start_time;
        campaign.end_time = req.body.end_time;
        campaign.save(function(err) {
          if (err) {
            console.log(err);
            //检查信息是否重复
            switch (err.code) {
              case 11000:
                  break;
              case 11001:
                  res.status(400).send('该活动已经存在!');
                  break;
              default:
                  break;
            }
            return;
          };

          //生成动态消息

          var message = new Message();
          message.message_type = 'GroupMessage';
          message.group_message_body.group.gid.push(gid);
          message.group_message_body.group.group_type.push(group_type);
          message.group_message_body.group.active = true,
          message.group_message_body.group.date = req.body.create_time,

          message.group_message_body.group.poster.cid = cid;
          message.group_message_body.group.poster.uid = uid;
          message.group_message_body.group.poster.role = 'LEADER';

          message.content = content;

          message.save(function(err) {
            if (err) {
              //错误信息
              return;
            }
          });
        });
      } else {
          //查无此人
      }
  });
};


//生成小组活动列表
exports.list = function (req, res) {
  Campaign.find(null,function(err,campaign){
      if (err) {
          res.status(400).send([]);
          return;
      };
      var _length = campaign.length;
      var campaigns = [];

      for(var i = 0; i < _length; i ++){
        campaigns.push({ 
          'cid':campaign[i].campaign.cid[0],
          'gid':campaign[i].campaign.gid,
          'group_type':campaign[i].campaign.group_type
        });
      }
      
      res.send(campaigns);
  });
}
