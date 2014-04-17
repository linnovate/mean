'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    GroupMessage = mongoose.model('GroupMessage'),
    Campaign = mongoose.model('Campaign'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    Group = mongoose.model('Group'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    Provoke = mongoose.model('Provoke');

exports.saveGroups = function(req,res) {
    res.send('save');
   /* var _length =req.body.group.length();
    for(var _i=0;_i<_length;_i++){

    }
    var group = new Group();
    group.name = req.body.name;
    company.info.city.province = req.body.province;
    company.info.city.city = req.body.city;
    company.info.address = req.body.address;
    company.info.linkman = req.body.linkman;
    company.info.lindline.areacode = req.body.areacode;
    company.info.lindline.number = req.body.number;
    company.info.lindline.extension = req.body.extension;
    company.info.phone = req.body.phone;
    company.email.host = req.body.host;
    company.email.domain[0] = req.body.domain;

    company.provider = 'company';
    company.save(function(err) {
        if (err) {
            console.log(err);
            //检查信息是否重复
            switch (err.code) {
                case 11000:
                    break;
                case 11001:
                    res.status(400).send('该公司已经存在!');
                    break;
                default:
                    break;
            }
            return res.render('company/company_signup', {
                company: company
            });
        }
        //发送邮件
        mail.sendCompanyActiveMail(company.email.host+'@'+company.email.domain[0],company.info.name);
        res.render('company/company_wait', {
            title: '等待验证',
            message: '您的申请信息已经提交,等验证通过后我们会向您发送一封激活邮件,请注意查收!'
        });
    });*/
};


//返回组件模型里的所有组件,待HR选择
exports.getGroups = function(req,res) {
  console.log('ok');
  Group.find(null,function(err,group){
      if (err) {
          console.log(err);
          res.status(400).send([]);
          return;
      };
      var _length = group.length;
      var groups = [];

      for(var i = 0; i < _length; i++ ){
        groups.push({'id':group[i].gid,'type':group[i].group_type,'select':'0'});
      }
      console.log(groups);
      res.send(groups);
  });
};


exports.getAccount =function(req,res) {

};

exports.getInfo =function(req,res) {

};



exports.Info =function(req,res) {
  if(req.params.groupId == null && req.session.gid!=null) {
    CompanyGroup.findOne({
        cid: req.session.cid,
        gid: req.session.gid
      },function(err, companyGroup) {
          if (err) {
              console.log(err);
              return;
          }
          else {
              res.render('group/group_info', {
                  'companyGroup': companyGroup,
                  'companyname': req.session.cpname
              });
          }
      });
  }
  else if(req.session.cpname != null || req.session.username != null ) {
      console.log(req.companyGroup);
      res.render('group/group_info', {
          title: '小组信息管理',
          companyGroup: req.companyGroup,
          companyname: req.session.cpname
      });
  }
  else
      res.redirect('/users/signin');
};

exports.saveInfo =function(req,res) {
    if(req.session.cid != null) {
      console.log(req.body);
        CompanyGroup.findOne({cid : req.session.cid, gid : req.body.companyGroup.gid}, function(err, companyGroup) {
            if (err) {
                console.log('数据错误');
                res.send({'result':0,'msg':'数据查询错误'});
                return;
            };
            if(companyGroup) {
                companyGroup.name = req.body.companyGroup.name;
                companyGroup.brief = req.body.companyGroup.brief;
                companyGroup.save(function (s_err){
                    if(s_err){
                        console.log(s_err);
                        res.send({'result':0,'msg':'数据保存错误'});
                        return;
                    }
                });
                res.send({'result':1,'msg':'更新成功'});
            } else {
                res.send({'result':0,'msg':'不存在组件！'});
            }
        });
    }
    else
        res.send({'result':0,'msg':'未登录'});
};

//返回组件页面
exports.home = function(req, res) {
  if (req.params.groupId != null) {
    req.session.gid = req.params.groupId;
  }
  Company.findOne({'id': req.session.cid}, function(err, company) {
    if (err) {
      console.log(err);
      return;
    } else {
      return res.render('group/home', {gids: company.gid});
    }
  });
};

//返回公司组件的所有数据,待前台调用
exports.getCompanyGroups = function(req, res) {

  var company_id = req.session.cid;
  var param_id = req.params.id;
  if(param_id) {
    company_id = param_id;
  }
  //console.log(company_id);
  CompanyGroup.find({cid: company_id}, function(err, company_groups) {
    if (err) {
      //console.log(err);
      return res.status(404).send([]);
    } else {
      //console.log(company_groups);
      return res.send(company_groups);
    }
  });
};

exports.group = function(req, res, next, id) {
  CompanyGroup
    .findOne({
        cid: req.session.cid,
        gid: id
    })
    .exec(function(err, companyGroup) {
        if (err) return next(err);
        if (!companyGroup) return next(new Error(req.session.cid+' Failed to load companyGroup ' + id));
        req.companyGroup = companyGroup;
        next();
    });
};

//返回小组动态消息
exports.getGroupMessage = function(req, res) {

  var cid = req.session.cid;
  var gid = req.session.gid;

  //有包含gid的消息都列出来
  GroupMessage.find({'cid' : {'$all':[cid]}, 'group.gid' : {'$all':[gid]}}, function(err, group_messages) {
    if (err) {
      console.log(err);
      return res.status(404).send([]);
    } else {
        return res.send(group_messages);
    }
  });
};


//返回某一小组的活动,待前台调用
exports.getGroupCampaign = function(req, res) {

  var cid = req.session.cid;
  var gid = req.session.gid;
  var uid = req.session.uid;

  //有包含gid的活动都列出来
  Campaign.find({'cid' : {'$all':[cid]}, 'gid' : {'$all':[gid]}}, function(err, campaign) {
    if (err) {
      console.log(err);
      return res.status(404).send([]);
    } else {
      var campaigns = [];
      var join = false;
      var length = campaign.length;
      for(var i = 0;i < length; i ++) {
        join = false;
        for(var j = 0;j < campaign[i].member.length; j ++) {
          if(uid === campaign[i].member[j].uid) {
            join = true;
            break;
          }
        }
        campaigns.push({
          'active':campaign[i].active,
          'active_value':campaign[i].active ? '关闭' : '打开',
          'id': campaign[i].id,
          'gid': campaign[i].gid,
          'group_type': campaign[i].group_type,
          'cid': campaign[i].cid,
          'cname': campaign[i].cname,
          'poster': campaign[i].poster,
          'content': campaign[i].content,
          'member': campaign[i].member,
          'create_time': campaign[i].create_time,
          'start_time': campaign[i].start_time,
          'end_time': campaign[i].end_time,
          'join':join
        });
      }
      return res.send(campaigns);
    }
  });
};

//组长关闭活动
exports.campaignCancel = function (req, res) {
  var campaign_id = req.body.campaign_id;
  Campaign.findOne({id:campaign_id},function(err, campaign) {
        if(campaign) {
            if (err) {
                console.log('错误');
            }

            var active = campaign.active;
            campaign.active = !active;
            campaign.save();

            return res.send('ok');
            //console.log('创建成功');
        } else {
            return res.send('not exist');
        }
    });
};


//约战
exports.provoke = function (req, res) {
  var lid = req.session.uid;
  var lname = req.session.username;
  var provoke_model = req.body.provoke_model;
  var cid_a = req.session.cid;    //约战方公司id
  var cid_b = req.body.cid;       //被约方公司id(如果是同一家公司那么cid_b = cid_a)
  var gid = req.body.gid;         //约战小组id
  var group_type = req.body.group_type;
  var content = req.body.content;
  var provoke = new Provoke();
  var team_a = req.body.team_a;   //约战方队名
  var team_b = req.body.team_b;   //被约方队名
  provoke.id = Date.now().toString(32) + Math.random().toString(32);
  provoke.gid = gid;
  provoke.group_type = group_type;
  provoke.group_a.cid = cid_a;
  provoke.group_a.lid = lid;
  provoke.group_a.start_confirm = true;
  provoke.group_a.lname = lname;
  provoke.poster.cid = cid_a;
  provoke.poster.uid = lid;
  provoke.poster.username = lname;
  provoke.poster.role = "LEADER";
  provoke.content = req.body.content;

  var provoke_message_id = Date.now().toString(32) + Math.random().toString(32);
  provoke.provoke_message_id = provoke_message_id;


  provoke.save(function(err) {
    if (err) {
      console.log(err);
      //检查信息是否重复
      switch (err.code) {
        case 11000:
            break;
        case 11001:
            res.status(400).send('该约战已经存在!');
            break;
        default:
            break;
      }
        return;
    }

    //生成动态消息
    var groupMessage = new GroupMessage();

    groupMessage.id = provoke_message_id;
    groupMessage.group.gid.push(gid);
    groupMessage.provoke.active = true,
    groupMessage.provoke.team_a = team_a;
    groupMessage.provoke.team_b = team_b;

    groupMessage.poster.cname = cname;
    groupMessage.poster.cid = cid;
    groupMessage.poster.uid = uid;
    groupMessage.poster.role = 'LEADER';
    groupMessage.poster.username = username;
    groupMessage.cid.push(cid_a);
    groupMessage.cid.push(cid_b);

    groupMessage.content = content;

    groupMessage.save(function (err) {
      if (err) {
        res.send(err);
        return;
      }

      //这里要注意一下,生成动态消息后还要向被约队长发一封私信
    });
  });
};


//应约
exports.responseProvoke = function (req, res) {
  var provoke_message_id = req.body.provoke_message_id;
  /*
  Provoke.findOne({
      'provoke_message_id' : provoke_message_id
    },
    function (err, provoke) {

  });
  */
};


//组长发布一个活动(只能是一个企业)
exports.sponsor = function (req, res) {

  var username = req.session.username;
  var cid = req.session.cid;  //公司id
  var uid = req.session.uid;  //用户id
  var gid = req.session.gid;     //组件id,组长一次对一个组发布活动
  var content = req.body.content;//活动内容
  var cname = '';

  //生成活动
  var campaign = new Campaign();
  campaign.gid.push(gid);
  campaign.cid.push(cid);//其实只有一个公司

  Company.findOne({
      id : cid
    },
    function (err, company) {
      cname = company.info.name;
  });

  campaign.id = Date.now().toString(32) + Math.random().toString(32) + '0';
  campaign.poster.cname = cname;
  campaign.poster.cid = cid;
  campaign.poster.uid = uid;
  campaign.poster.role = 'LEADER';
  campaign.poster.username = username;
  campaign.content = content;
  campaign.active = true;

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
    }

    //生成动态消息
    var groupMessage = new GroupMessage();

    groupMessage.id = Date.now().toString(32) + Math.random().toString(32) + '1';
    groupMessage.group.gid.push(gid);
    //groupMessage.group.group_type.push(group_type);
    groupMessage.active = true;
    groupMessage.cid.push(cid);

    groupMessage.poster.cname = cname;
    groupMessage.poster.cid = cid;
    groupMessage.poster.uid = uid;
    groupMessage.poster.role = 'LEADER';
    groupMessage.poster.username = username;

    groupMessage.content = content;

    groupMessage.save(function (err) {
      if (err) {
        res.send(err);
        return;
      }
    });
  });

  res.send("ok");
};


exports.getGroupMember = function(req,res){

  var cid = req.session.cid;
  var gid = req.session.gid;

  CompanyGroup
    .findOne({
        'cid': cid,
        'gid': gid
    },function(err, companyGroup) {
        if(err){
          console.log(err);
          return res.status(404).send(err);
        };
        var _member_list =[];
        if(companyGroup){
          _member_list = companyGroup.member;
        };
        console.log(_member_list);
        return res.send(_member_list);
    });

};
