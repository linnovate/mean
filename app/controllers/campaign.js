
var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    Campaign = mongoose.model('Campaign');

//返回公司发布的所有活动,待前台调用
exports.getCompanyCampaign = function(req, res) {

  var cid = req.session.cid;//根据公司id取出该公司的所有活动(公司id是参数传进来的)

  //公司发布的活动都归在虚拟组 gid = 0 里
  Campaign.find({'poster.cid' : cid, 'group.gid[0]' : 0}, function(err, campaigns) {
    if (err) {
      console.log(err);
      return res.status(404).send([]);
    } else {
      return res.render('partials/campaign_list',
        {title: '企业活动列表',
          campaigns: campaigns
      });
    }
  });
};


//返回某一小组的活动,待前台调用
exports.getGroupCampaign = function(req, res) {

  var cid = req.session.cid;//根据公司id取出该公司的所有活动(公司id是参数传进来的)
  var gid = req.session.gid;//必须是数字类型哦,必要的时候要用parseInt()转换

  //有包含gid的活动都列出来
  Campaign.find({'poster.cid' : cid, 'gid' : {'$all':[gid]}}, function(err, campaigns) {
    if (err) {
      console.log(err);
      return res.status(404).send([]);
    } else {
      return res.render('partials/campaign_list',
        {title: '小组活动列表',
          campaigns: campaigns
      });
    }
  });
};