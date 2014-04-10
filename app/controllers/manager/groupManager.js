//小组管理(比如组长发布组内活动,组内成员管理等)
'use strict';

var mongoose = require('mongoose'),
    encrypt = require('../../middlewares/encrypt'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    GroupMessage = mongoose.model('GroupMessage'),
    Campaign = mongoose.model('Campaign'),
    User = mongoose.model('User'),
    Comapny = mongoose.model('Company'),
    config = require('../../config/config');





exports.groupManager = function (req, res) {
  res.render('users/group_manager/manager', {
        title: '小组管理'
    });
};
//组长发布一个活动(只能是一个企业)
exports.sponsor = function (req, res) {
  var cid = req.session.cid;  //公司id
  var uid = req.session.uid;  //用户id
  var gid = req.body.gid;  //组件id,注意,这里是数组,因为一个组长可以管理很多组
  var group_type = req.body.group_type; //组件类型,和id一一对应
  var content = req.body.content;//活动内容
  var cname = '';


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
            cname = company.info.name;
        });

        campaign.id = Date.now().toString(32) + Math.random().toString(32) + '0';
        campaign.campaign.poster.cname = cname;
        campaign.campaign.poster.cid = cid;
        campaign.campaign.poster.uid = uid;
        campaign.campaign.poster.role = 'LEADER';
        campaign.campaign.poster.realname = user.realname;
        campaign.campaign.poster.username = user.username;
        campaign.campaign.content = content;

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
          var groupMessage = new GroupMessage();

          groupMessage.id = Date.now().toString(32) + Math.random().toString(32) + '1';
          groupMessage.group.gid.push(gid);
          groupMessage.group.group_type.push(group_type);
          groupMessage.group.active = true,
          groupMessage.group.date = req.body.create_time,

          groupMessage.group.poster.cname = cname;
          groupMessage.group.poster.cid = cid;
          groupMessage.group.poster.uid = uid;
          groupMessage.group.poster.role = 'LEADER';
          groupMessage.group.poster.realname = user.realname;
          groupMessage.group.poster.username = user.username;

          groupMessage.content = content;

          groupMessage.save(function(err) {
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

