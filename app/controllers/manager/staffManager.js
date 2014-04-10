//员工管理(参加活动、查看活动信息、查看个人信息等)
'use strict';

var mongoose = require('mongoose'),
    encrypt = require('../../middlewares/encrypt'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    GroupMessage = mongoose.model('GroupMessage'),
    Campaign = mongoose.model('Campaign'),
    User = mongoose.model('User'),
    Comapny = mongoose.model('Company'),
    config = require('../../config/config');


//员工参加活动
exports.joinCampaign = function (req, res) {
  var cid = req.params.cid;
  var gid = req.params.gid;
  var uid = req.params.uid;
  var campaign_id = req.params.compaign_id; //该活动的id
  Campaign.findOne({
        id : campaign_id
    },
    function (err, campaign) {
      if (campaign) {
        campaign.campaign.member.push({'cid':cid, 'gid':gid, 'uid':uid});
        campaign.save(function (err) {
          console.log(err);
        });
      } else {
          console.log('没有此活动!');
      }
  });
};


//员工退出活动
exports.joinCampaign = function (req, res) {
  var cid = req.params.cid;
  var gid = req.params.gid;
  var uid = req.params.uid;
  var campaign_id = req.params.compaign_id; //该活动的id
  Campaign.findOne({
        id : campaign_id
    },
    function (err, campaign) {
      if (campaign) {

        //删除该员工信息
        for( var i = 0; i < campaign.member.length; i ++) {
          if (campaign.member[i].uid === uid) {
            campaign.member.splice(i,1);
            break;
          }
        }

        campaign.save(function (err) {
          console.log(err);
        });
      } else {
          console.log('没有此活动!');
      }
  });
};
