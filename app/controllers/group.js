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
    Competition = mongoose.model('Competition');


//返回组件模型里的所有组件(除了虚拟组),待HR选择
exports.getGroups = function(req,res) {
  Group.find(null,function(err,group){
      if (err) {
          console.log(err);
          res.status(400).send([]);
          return;
      };
      var _length = group.length;
      var groups = [];


      for(var i = 0; i < _length; i++ ){
        if(group[i].gid!=0){
          groups.push({'id':group[i].gid,'type':group[i].group_type,'select':'0', 'entity_type':group[i].entity_type});
        }
      }
      res.send(groups);
  });
};

exports.info =function(req,res) {
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
      return res.render('group/home', {groups: company.group});
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
  Company.findOne({id: company_id}, function(err, company) {
    if (err) {
      //console.log(err);
      return res.status(404).send([]);
    } else {
      //console.log(company_groups);
      return res.send(company.group);
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
  GroupMessage.find({'cid' : {'$all':[cid]}, 'group.gid' : {'$all':[gid]}}, function(err, group_message) {
    if (err) {
      console.log(err);
      return res.status(404).send([]);
    } else {
      var group_messages = [];
      var length = group_message.length;
      for(var i = 0; i < length; i ++) {
        group_messages.push({
          'id': group_message[i].id,
          'cid': group_message[i].cid,
          'group': group_message[i].group,
          'active': group_message[i].active,
          'date': group_message[i].date,
          'poster': group_message[i].poster,
          'content': group_message[i].content,
          'provoke': group_message[i].provoke,
          'provoke_accept': group_message[i].provoke.active && (group_message[i].provoke.uid_opposite === req.session.uid) && (!group_message[i].provoke.start_confirm) ? true : false
        });
      }
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
          'create_time': campaign[i].create_time ? campaign[i].create_time.toLocaleDateString() : '',
          'start_time': campaign[i].start_time ? campaign[i].start_time.toLocaleDateString() : '',
          'end_time': campaign[i].end_time ? campaign[i].end_time.toLocaleDateString() : '',
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
  var uid = req.session.uid;
  var username = req.session.username;

  var cid = req.session.cid;    //约战方公司id
  var cid_opposite = req.body.cid_opposite;       //被约方公司id(如果是同一家公司那么cid_b = cid_a)
  var gid = req.session.gid;         //约战小组id

  var content = req.body.content;
  var competition_format = req.body.competition_format;
  var location = req.body.location;
  var competition_date = req.body.competition_date;
  var deadline = req.body.deadline;
  var remark = req.body.remark;
  var competition = new Competition();


  var team_a = req.body.team_a;   //约战方队名
  var team_b = req.body.team_b;   //被约方队名

  var uid_opposite = req.body.uid_opposite;    //被约方队长id


  competition.id = Date.now().toString(32) + Math.random().toString(32) + 'a';
  competition.gid = gid;
  //provoke.group_type = group_type;

  competition.camp_a.cid = cid;
  competition.camp_a.uid = uid;
  competition.camp_a.start_confirm = true;
  competition.camp_a.username = username;
  competition.camp_a.tname = team_a;


  competition.camp_b.cid = cid_opposite;               //被约方的公司id和队长id先存进去,到时候显示动态时将据此决定是否显示"应约"按钮
  competition.camp_b.uid = uid_opposite;
  competition.camp_b.tname = team_b;

  competition.content = req.body.content;
  competition.brief.remark = req.body.remark;
  competition.brief.location = location;
  competition.brief.competition_date = competition_date;
  competition.brief.deadline = deadline;
  competition.brief.competition_format = competition_format;

  var provoke_message_id = Date.now().toString(32) + Math.random().toString(32) + 'b';
  competition.provoke_message_id = provoke_message_id;

  var _callback = function(provoke_message_id) {
    return function(err) {
      if (err) {
        console.log('保存约战时出错' + err);
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
        res.send(err);
        return;
      }

      //生成动态消息
      var groupMessage = new GroupMessage();

      groupMessage.id = provoke_message_id;
      groupMessage.group.gid.push(gid);
      groupMessage.provoke.active = true,
      groupMessage.provoke.team_a = team_a;
      groupMessage.provoke.team_b = team_b;
      groupMessage.provoke.uid_opposite = uid_opposite;

      //groupMessage.poster.cname = cname;
      groupMessage.poster.cid = cid;
      groupMessage.poster.uid = uid;
      groupMessage.poster.role = 'LEADER';
      groupMessage.poster.username = username;
      groupMessage.cid.push(cid);
      if(cid !== cid_opposite) {
        groupMessage.cid.push(cid_opposite);
      }
      groupMessage.content = content;
      groupMessage.save(function (err) {
        if (err) {
          console.log('保存约战动态时出错' + err);
          res.send(err);
          return;
        }
        return res.send('ok');
        //这里要注意一下,生成动态消息后还要向被约队长发一封私信
      });
    };
  };
  competition.save(_callback(provoke_message_id));
};


//应约
exports.responseProvoke = function (req, res) {
  var username = req.session.username;
  var provoke_message_id = req.body.provoke_message_id;
  Competition.findOne({
      'provoke_message_id' : provoke_message_id
    },
    function (err, competition) {
      competition.camp_b.start_confirm = true;
      competition.camp_a.username = username;
      //还要存入应约方的公司名、队长用户名、真实姓名等
      competition.save(function (err) {
        if (err) {
          res.send(err);
          return;
        }
        //双方都确认后就可以将约战变为活动啦
        var campaign = new Campaign();
        campaign.gid.push(competition.gid);
        campaign.group_type.push(competition.group_type);

        if(competition.camp_a.cid !== competition.camp_b.cid){
          campaign.cid.push(competition.camp_b.cid);
        }
        campaign.cid.push(competition.camp_a.cid);   //两家公司同时显示这一条活动
        campaign.id = Date.now().toString(32) + Math.random().toString(32);

        campaign.poster.cname = competition.camp_a.cname;
        campaign.poster.cid = competition.camp_a.cid;
        campaign.poster.uid = competition.camp_a.uid;
        campaign.poster.role = 'LEADER';
        campaign.poster.username = competition.camp_a.username;
        campaign.content = competition.content + '  来来来,现在是 ' + competition.camp_a.tname + ' VS ' + competition.camp_b.tname;
        campaign.active = true;

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
          GroupMessage.findOne({'id' : provoke_message_id}, function (err, group_message) {
            if (err) {

            } else {
              group_message.provoke.start_confirm = true;
              group_message.save();
            }
          });
          res.send('ok');
        });
    });
  });
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

exports.competition = function(req, res){
  res.render('competition/football', {
          title: '发起足球比赛'
  });
};

