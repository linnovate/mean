//HR管理(发布企业活动,整个企业的活动、组件管理等)
'use strict';

var mongoose = require('mongoose'),
    encrypt = require('../../middlewares/encrypt'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    GroupMessage = mongoose.model('GroupMessage'),
    Campaign = mongoose.model('Campaign'),
    User = mongoose.model('User'),
    Comapny = mogoose.model('Company'),
    config = require('../../config/config');


//HR发布一个活动(可能是多个企业)

exports.sponsor = function (req, res) {

  var cid = req.session.cid;    //公司id
  var uid = req.session.uid;    //用户id
  var gid = 0;                  //HR发布的活动,全部归在虚拟组里,虚拟组的id默认是0
  var group_type = '虚拟组';
  var company_id = req.body.cid;//公司id数组,HR可以发布多个公司一起的的联谊或者约战活动,注意:第一个公司默认就是次hr所在的公司!

  var content = req.body.content;//活动内容

  var cname = '';

  User.findOne({
        id : uid
    },
    function (err, user) {
      if (user) {

        //生成活动
        var campaign = new Campaign();

        campaign.campaign.gid.push(gid);
        campaign.campaign.group_type.push(group_type);

        campaign.campaign.cid = company_id; //一定要和cid区分开啊

        for(var i = 0; i < company_id.length; i ++) {
          Company.findOne({
            id : company_id[i]
          },
          function (err, company) {
            campaign.campaign.cname.push(company.info.name);
            if (i == 0) {
              cname = company.info.name; //默认规定一起活动的第一个公司就是hr所在的公司
            }
          });
        }

        campaign.id = Date.now().toString(32) + Math.random().toString(32) + '0';
        campaign.campaign.poster.cname = cname;
        campaign.campaign.poster.cid = cid;
        campaign.campaign.poster.uid = uid;
        campaign.campaign.poster.role = 'HR';
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
          groupMessage.group.poster.role = 'HR';
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