'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    crypto = require('crypto'),
    meanConfig = require('../../config/config'),
    GroupMessage = mongoose.model('GroupMessage'),
    Campaign = mongoose.model('Campaign'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    Group = mongoose.model('Group'),
    UUID = require('../middlewares/uuid'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    Competition = mongoose.model('Competition'),
    PhotoAlbum = mongoose.model('PhotoAlbum'),
    validator = require('validator'),
    async = require('async'),
    fs = require('fs'),
    gm = require('gm').subClass({ imageMagick: true });


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



exports.renderInfo = function (req, res) {
  res.render('group/group_info');
};


//小队信息维护
exports.info =function(req,res) {

  var entity_type = req.session.companyGroup.entity_type;
  var Entity = mongoose.model(entity_type);//将对应的增强组件模型引进来
  if(req.session.cpname != null || req.session.username != null ) {
    var gid = req.params.groupId != null ? req.params.groupId : req.session.gid;
    Entity.findOne({
        'cid': req.session.cid,
        'gid': gid
      },function(err, entity) {
          if (err) {
              console.log(err);
              return res.send(err);
          } else {
              return res.send({
                  'companyGroup': req.session.companyGroup,  //父小组信息
                  'entity': entity,                           //实体小组信息
                  'companyname':req.session.cpname
              });
          }
      });
  } else
      res.redirect('/users/signin');
};

exports.saveInfo =function(req,res) {
    if(req.session.cid != null) {
        CompanyGroup.findOne({cid : req.session.cid, gid : req.session.gid}, function(err, companyGroup) {
            if (err) {
                console.log('数据错误');
                res.send({'result':0,'msg':'数据查询错误'});
                return;
            };
            if(companyGroup) {
                companyGroup.name = req.body.name;
                companyGroup.brief = req.body.brief;
                companyGroup.save(function (s_err){
                    if(s_err){
                        console.log(s_err);
                        res.send({'result':0,'msg':'数据保存错误'});
                        return;
                    }
                    var entity_type = req.session.companyGroup.entity_type;
                    var Entity = mongoose.model(entity_type);//将对应的增强组件模型引进来
                    var gid = req.params.groupId != null ? req.params.groupId : req.session.gid;
                    Entity.findOne({
                        'cid': req.session.cid,
                        'gid': gid
                      },function(err, entity) {
                          if (err) {
                              console.log(err);
                              return res.send(err);
                          } else if(entity){
                            console.log(res.body);
                            entity.home_court = req.body.homecourt;
                            entity.save(function(err){
                              if(err){
                                console.log(err);
                                return;
                              }
                              res.send({'result':1,'msg':'更新成功'});
                            })
                          }
                      });
                });
            } else {
                res.send({'result':0,'msg':'不存在组件！'});
            }
        });
    }
    else
        res.send({'result':0,'msg':'未登录'});
};
//小队信息维护







//返回组件页面
exports.home = function(req, res) {
  if (req.params.groupId != null) {
    req.session.gid = req.params.groupId;
  }



  if(req.session.role=='HR'){
    Company.findOne({'id': req.session.cid}, function(err, company) {
      if (err) {
        console.log(err);
        return res.status(404).send();
      } else {
        Group.find(null,function(err,group){
          if (err) {
            console.log(err);
            return res.status(404).send();;
          };
          var _ugids = [];
          var tmp_gid = [];
          var _glength = group.length;
          for(var j=0;j<company.group.length;j++){
            tmp_gid.push(company.group[j].gid);
          }
          for(var i=0;i<_glength;i++){
            if(group[i].gid != 0 && tmp_gid.indexOf(group[i].gid) == -1){
              _ugids.push(group[i].gid);
            }
          };
          CompanyGroup.findOne({ gid: req.session.gid, cid: req.user.cid }).exec(function(err, company_group) {

            var photo_album_ids = [];
            company_group.photo.forEach(function(photo_album) {
              photo_album_ids.push(photo_album.pid);
            })
            PhotoAlbum.where('_id').in(photo_album_ids)
            .exec(function(err, photo_albums) {
              if (err) { console.log(err); }
              else if(photo_albums) {
                var visible_photo_albums = [];
                photo_albums.forEach(function(photo_album) {
                  if (photo_album.hidden === false) {
                    visible_photo_albums.push(photo_album);
                  }
                });
                res.render('group/home', {
                  'groups': company.group,
                  'ugids':_ugids,
                  'tname': (req.companyGroup.name !== undefined && req.companyGroup.name !== null) ? req.companyGroup.name : '未命名',
                  'number': (req.companyGroup.member !== undefined && req.companyGroup.member !== null) ? req.companyGroup.member.length : 0,
                  'score': (req.companyGroup.score !== undefined && req.companyGroup.score !== null) ? req.companyGroup.score : 0,
                  'role': req.session.role === 'EMPLOYEE',  //等加入权限功能后再修改  TODO
                  'logo': company_group.logo,
                  'group_id': company_group._id,
                  'photo_albums': visible_photo_albums
                });
              }
            });

          });
        });
      }
    });
  }
  else{
        Group.find(null,function(err,group){
          if (err) {
            console.log(err);
            return res.status(404).send();;
          };
          var _ugids = [];
          var tmp_gid = [];
          var _glength = group.length;
          var _uglenth = req.user.group.length;
          for(var j=0;j<_uglenth;j++){
            tmp_gid.push(req.user.group[j].gid);
          }
          for(var i=0;i<_glength;i++){
            if(group[i].gid != 0 && tmp_gid.indexOf(group[i].gid) == -1){
              _ugids.push(group[i].gid);
            }
          };
          CompanyGroup.findOne({ gid: req.session.gid, cid: req.user.cid }).exec(function(err, company_group) {

            var photo_album_ids = [];
            company_group.photo.forEach(function(photo_album) {
              photo_album_ids.push(photo_album.pid);
            })
            PhotoAlbum.where('_id').in(photo_album_ids)
            .exec(function(err, photo_albums) {
              if (err) { console.log(err); }
              else if(photo_albums) {
                var visible_photo_albums = [];
                photo_albums.forEach(function(photo_album) {
                  if (photo_album.hidden === false) {
                    visible_photo_albums.push(photo_album);
                  }
                });
                res.render('group/home', {
                  'groups': req.user.group,
                  'ugids':_ugids,
                  'tname': (req.companyGroup.name !== undefined && req.companyGroup.name !== null) ? req.companyGroup.name : '未命名',
                  'number': (req.companyGroup.member !== undefined && req.companyGroup.member !== null) ? req.companyGroup.member.length : 0,
                  'score': (req.companyGroup.score !== undefined && req.companyGroup.score !== null) ? req.companyGroup.score : 0,
                  'role': req.session.role === 'EMPLOYEE',  //等加入权限功能后再修改  TODO
                  'logo': company_group.logo,
                  'group_id': company_group._id,
                  'photo_albums': visible_photo_albums
                });
              }
            });

          });
        });
  }

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
      return res.send({
        'group':company.group,
        'cid':company_id
      });
    }
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

        var leader = false;
        for(var j = 0; j < req.user.group.length; j ++) {
          if(req.user.group[j].gid === gid) {
            leader = req.user.group[j].leader;
          }
        }
        group_messages.push({
          'id': group_message[i].id,
          'cid': group_message[i].cid,
          'group': group_message[i].group,
          'active': group_message[i].active,
          'date': group_message[i].date,
          'poster': group_message[i].poster,
          'content': group_message[i].content,
          'provoke': group_message[i].provoke,                   //应约按钮显示要有四个条件:1.该约战没有关闭 2.当前员工所属组件id和被约组件id一致 3.约战没有确认 4.当前员工是该小队的队长
          'provoke_accept': group_message[i].provoke.active && (group_message[i].group.gid[0] === gid) && leader && (!group_message[i].provoke.start_confirm) && (group_message[i].cid[1] === req.session.cid)
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

        //参加过的也不能参加
        for(var j = 0;j < campaign[i].member.length; j ++) {
          if(uid === campaign[i].member[j].uid) {
            join = true;
            break;
          }
        }

        //判断这个组是不是员工所属的组,否则不能参加
        //这个逻辑暂时用不到(因为员工只能进入自己加入的兴趣小组),以后员工可能
        //可以进入他没有加入的兴趣小组,所以先把逻辑功能留在这里
        var permission = false;
        var stop = false;
        for(var j = 0; j < campaign[i].gid.length && !stop; j ++) {
          for(var k = 0; k < req.user.group.length; k ++) {
            if(req.user.group[k].gid === campaign[i].gid[j]) {
              permission = (req.user.group[k].leader === true);     //只有这个组的组长才可以操作活动
              stop = true;
              break;
            }
          }
        }

        campaigns.push({
          'active':campaign[i].active && stop,              //如果该活动没有关闭并且该员工有这个活动的组,就显示参加按钮
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
          'join':join,
          'provoke':campaign[i].provoke
        });
      }

      return res.send({
        'data':campaigns,
        'permission':permission
      });
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
  var number = req.body.number;

  var team_a = req.session.companyGroup.name;   //约战方队名
  var team_opposite = req.body.team_opposite;   //被约方队名

  competition.id = UUID.id();
  competition.gid = gid;
  competition.group_type = req.session.companyGroup.group_type;

  competition.camp_a.cid = cid;
  competition.camp_a.start_confirm = true;
  competition.camp_a.tname = team_a;
  competition.camp_a.logo = req.session.companyGroup.logo;

  var photo_album = new PhotoAlbum();
  photo_album.save();

  competition.photo = { pid: photo_album._id, name: photo_album.name };
  fs.mkdir(meanConfig.root + '/public/img/photo_album/' + photo_album._id, function(err) {
    if (err) console.log(err);
  });

  //这个查询就为了找对方小队的一个logo
  //速度换空间
  CompanyGroup.findOne({'cid':cid_opposite,'gid':gid},function(err, company_group){
    if(err) {
      return res.send(err);
    } else {
      if(company_group) {
        competition.camp_b.logo = company_group.logo;
        competition.camp_b.cid = cid_opposite;               //被约方的公司id
        competition.camp_b.tname = team_opposite;

        competition.content = req.body.content;
        competition.brief.remark = req.body.remark;
        competition.brief.location.name = location;
        competition.brief.competition_date = competition_date;
        competition.brief.deadline = deadline;
        competition.brief.competition_format = competition_format;
        competition.brief.number = number;


        var groupMessage = new GroupMessage();
        groupMessage.id = UUID.id();
        groupMessage.group.gid.push(gid);
        groupMessage.group.group_type.push(competition.group_type);
        groupMessage.provoke.active = true,
        groupMessage.provoke.team_a = team_a;
        groupMessage.provoke.team_b = team_opposite;

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
            return res.send(err);
          } else {
            competition.provoke_message_id = groupMessage.id;
            competition.save();
          }
          return res.send('ok');
          //这里要注意一下,生成动态消息后还要向被约队长发一封私信
        });
      } else {
        return res.send('null');
      }
    }
  });

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
        campaign.id = UUID.id();

        campaign.poster.cname = competition.camp_a.cname;
        campaign.poster.cid = competition.camp_a.cid;
        campaign.poster.uid = competition.camp_a.uid;
        campaign.poster.role = 'LEADER';
        campaign.poster.username = competition.camp_a.username;
        campaign.content = competition.content + '  来来来,现在是 ' + competition.camp_a.tname + ' VS ' + competition.camp_b.tname;
        campaign.active = true;
        campaign.provoke.active = true;
        campaign.provoke.competition_id = competition.id;
        campaign.provoke.active = true;

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





exports.campaignEdit = function (req, res) {
  var campaign_id = req.body.campaign_id;
  var content = req.body.content;
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;

  Campaign.findOne({'id':campaign_id}, function (err, campaign) {
    if(err) {
      return res.send(err);
    } else {
       GroupMessage.findOne({'content':campaign.content}, function (err, group_message) {
        if(err) {
          return res.send(err);
        } else {
          group_message.content = content;
          campaign.content = content;
          campaign.start_time = start_time;
          campaign.end_time = end_time;
          group_message.save(function (err) {
            if(err) {
              return res.send(err);
            } else {
              campaign.save();
              return res.send('ok');
            }
          })
        }
      });
      //console.log(campaign_id);
      //return res.send('ok');
    }
  });
};

//组长发布一个活动(只能是一个企业)
exports.sponsor = function (req, res) {

  var username = req.session.username;
  var group_type = req.session.companyGroup.group_type;
  var cid = req.session.cid;  //公司id
  var uid = req.session.uid;  //用户id
  var gid = req.session.gid;     //组件id,组长一次对一个组发布活动
  var content = req.body.content;//活动内容
  var cname = '';

  //生成活动
  var campaign = new Campaign();
  campaign.gid.push(gid);
  campaign.group_type.push(group_type);
  campaign.cid.push(cid);//其实只有一个公司

  Company.findOne({
      id : cid
    },
    function (err, company) {
      cname = company.info.name;
  });

  campaign.id = UUID.id();
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

    groupMessage.id = UUID.id();
    groupMessage.group.gid.push(gid);
    groupMessage.group.group_type.push(group_type);
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
        return res.send(_member_list);
    });

};



//比赛
exports.getCompetition = function(req, res){
  res.render('competition/football', {
    'title': '发起足球比赛',
    'competition' : req.competition,
    'team': req.competition_team,
    'leader' : req.session.leader
  });

};

exports.updateFormation = function(req, res){
  Competition.findOne({
    'id':req.params.competitionId
  }).exec(function(err, competition){
    console.log(req.competition_team ,req.body.competition_team);
    if(req.competition_team === req.body.competition_team){
      var _formation = [];
      var _tempFormation = req.body.formation;
      for (var member in _tempFormation){
        _formation.push({'uid':member,
                          'x':_tempFormation[member].x,
                          'y':_tempFormation[member].y

        });
      }
      if(req.competition_team ==='A'){
        competition.camp_a.formation = _formation;
      }
      else{
        competition.camp_b.formation = _formation;
      }
      competition.save(function(err){
        if(err){
          console.log(err);
        }
        return res.send({'result':1,'msg':'更新成功！'});
      });
    }
    else{
      return res.send({'result':0,'msg':'您没有权限修改阵形图'});
    }
  });
};

exports.competition = function(req, res, next, id){
  var first = false;

  Competition.findOne({
      'id':id
    }).exec(function(err, competition){
      if (err) return next(err);
      req.competition = competition;

      if(!first) {
        first = true;
        req.session.leader = false;
        var leader = req.session.companyGroup.leader;
        for(var i = 0; i < leader.length; i ++) {
          if(leader[i].uid = req.session.uid) {
            req.session.leader = true;
            break;
          }
        }
      }

      if(req.session.cid ===competition.camp_a.cid){
        req.competition_team = 'A';
      }
      else if(req.session.cid ===competition.camp_b.cid){
        req.competition_team = 'B';
      }
      else
      {
        return new next(Error('Failed to load competition ' + id));
      }
      next();
  });
};

//进入比赛页面先判断是否有对方发来的成绩确认信息
exports.hasConfirmMsg = function (req, res) {


  Competition.findOne({'gid':req.session.gid,
    '$or':[{
      'camp_a.cid':req.session.cid
    },{
      'camp_b.cid':req.session.cid
    }]
  }, function (err, competition) {
    if(competition.camp_a.cid === req.session.cid) {
      //发赛方收到应赛方的成绩确认消息
      if(competition.camp_b.result.confirm === true && competition.camp_a.result.confirm === false) {
        return res.send({
          'msg_show':true && req.session.leader,                    //比赛确认消息只有组长可见
          'score_a':competition.camp_a.score,
          'score_b':competition.camp_b.score,
          'rst_content':competition.camp_b.result.content,
          'date':competition.camp_b.result.start_date
        });
      } else {
        return res.send({
          'msg_show':false,
          'score_a':0,
          'score_b':0,
          'rst_content':'应赛方发来的消息',
          'date':0
        });
      }
    } else {
      //应赛方收到发赛方的成绩确认消息
      if(competition.camp_a.result.confirm === true && competition.camp_b.result.confirm === false) {
        return res.send({
          'msg_show':true && req.session.leader,
          'score_a':competition.camp_b.score,
          'score_b':competition.camp_a.score,
          'rst_content':competition.camp_a.result.content,
          'date':competition.camp_a.result.start_date
        });
      } else {
        return res.send({
          'msg_show':false,
          'score_a':0,
          'score_b':0,
          'rst_content':'发赛方发来的消息',
          'date':0
        });
      }
    }
  });
};


//某一方发送或者修改比赛成绩确认消息
exports.resultConfirm = function (req, res) {
  var competition_id = req.params.competitionId;

  var rst_accept = req.body.rst_accept;

  var score_a = req.body.score_a;
  var score_b = req.body.score_b;
  var rst_content = req.body.rst_content;

  Competition.findOne({'id' : competition_id}, function (err, competition) {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      if(req.session.cid === competition.camp_a.cid) {
        //发赛方发出成绩确认请求

        //发赛方接受应赛方的比分确认
        if(rst_accept) {
          competition.camp_a.result.confirm = true;
        //不接受或者第一次发出比赛确认
        } else {
          competition.camp_a.score = score_a;
          competition.camp_b.score = score_b;
          competition.camp_b.result.confirm = false,
          competition.camp_a.result.confirm = true,
          competition.camp_a.result.content = rst_content,
          competition.camp_a.result.start_date = Date.now();
        }
      } else {
        //应赛方发出成绩确认请求

        //应赛方接受发赛方的比分确认
        if(rst_accept) {
          competition.camp_b.result.confirm = true;

        //不接受或者第一次发出比赛确认
        } else {
          competition.camp_a.score = score_b;
          competition.camp_b.score = score_a;
          competition.camp_a.result.confirm = false,
          competition.camp_b.result.confirm = true,
          competition.camp_b.result.content = rst_content,
          competition.camp_b.result.start_date = Date.now();
        }
      }
      competition.save(function (err){
        if(err){
          return res.send(err);
        } else {
          return res.send('ok');
        }
      });
    }
  });
};


exports.group = function(req, res, next, id) {

  console.log(req.session.gid);
  CompanyGroup
    .findOne({
        cid: req.session.cid,
        gid: id
    })
    .exec(function(err, companyGroup) {
        if (err) return next(err);
        if (!companyGroup) return next(new Error(req.session.cid+' Failed to load companyGroup ' + id));
        req.companyGroup = companyGroup;
        //TODO session不能存太多东西
        req.session.companyGroup = companyGroup;
        next();
    });
};


//搜索小组
//目前只是将所有记录都列出来
//TODO
exports.searchGroup = function(req, res) {
  var cid = req.body.cid;   //根据公司名找它的组件
  CompanyGroup.find({'cid': cid}, function (err, company_groups){
    if(err){
      return res.send([]);
    }else{
      if(company_groups){
        //数据量会不会太大?
        return res.send(company_groups);
      } else {
        return res.send([]);
      }
    }
  });
};


exports.tempLogo = function(req, res) {

  var fs = require('fs');
  var temp_path = req.files.temp_photo.path;

  var target_dir = meanConfig.root + '/public/img/group/logo/temp/';
  if (!fs.existsSync(target_dir)) {
    fs.mkdirSync(target_dir);
  }

  var shasum = crypto.createHash('sha1');

  shasum.update(req.session.gid + req.user.cid);
  var target_img = shasum.digest('hex') + '.png';
  var target_path = target_dir + target_img;

  var gm = require('gm').subClass({ imageMagick: true });
  gm(temp_path)
  .write(target_path, function(err) {
    if (err) console.log(err);
    fs.unlink(temp_path, function(err) {
      if (err) throw err;
      res.send({ img: target_img });
    });
  });

};

exports.saveLogo = function(req, res) {
  var fs = require('fs');
  var user = req.user;

  var shasum = crypto.createHash('sha1');

  shasum.update(req.session.gid + req.user.cid);
  var temp_img = shasum.digest('hex') + '.png';

  var shasum = crypto.createHash('sha1');
  shasum.update( Date.now().toString() + Math.random().toString() );
  var logo = shasum.digest('hex') + '.png';


  // 文件系统路径，供fs使用
  var temp_path = meanConfig.root + '/public/img/group/logo/temp/' + temp_img;
  var target_dir = meanConfig.root + '/public/img/group/logo/';

  // uri路径，存入数据库的路径，供前端访问
  var uri_dir = '/img/group/logo/';

  var gm = require('gm').subClass({ imageMagick: true });
  try {
    gm(temp_path).size(function(err, value) {
      if (err) throw err;

      var w = req.body.width * value.width;
      var h = req.body.height * value.height;
      var x = req.body.x * value.width;
      var y = req.body.y * value.height;

      CompanyGroup.findOne({ gid: req.session.gid, cid: req.user.cid }).exec(function(err, company_group) {
        var ori_logo = company_group.logo;

        gm(temp_path)
        .crop(w, h, x, y)
        .resize(150, 150)
        .write(target_dir + logo, function(err) {
          if (err) throw err;

          else {
            company_group.logo = uri_dir + logo;
            company_group.save(function(err) {
              if (err) throw err;
            });

            fs.unlink(temp_path, function(err) {
              if (err) console(err);
              var unlink_dir = meanConfig.root + '/public';
              if (ori_logo && ori_logo !== '/img/group/logo/default.png') {
                if (fs.existsSync(unlink_dir + ori_logo)) {
                  fs.unlinkSync(unlink_dir + ori_logo);
                }
              }
              res.redirect('/group/editLogo');
            });
          }

        });
      });
    });
  } catch(e) {
    console.log(e);
    res.redirect('/group/editLogo');
  }
};

exports.editLogo = function(req, res) {
  CompanyGroup.findOne({ gid: req.session.gid, cid: req.user.cid }).exec(function(err, company_group) {
    res.render('group/editLogo', {
      logo: company_group.logo,
      id: company_group._id
    });
  });

};

exports.getLogo = function(req, res) {
  var id = req.params.id;
  var width = req.params.width;
  var height = req.params.height;
  if (validator.isNumeric(width + height)) {
    async.waterfall([
      function(callback) {
        CompanyGroup.findOne({ _id: id })
        .exec(function(err, company_group) {
          if (err) callback(err);
          else callback(null, company_group.logo);
        });
      },
      function(logo, callback) {
        res.set('Content-Type', 'image/png');
        gm(meanConfig.root + '/public' + logo)
        .resize(width, height, '!')
        .stream(function(err, stdout, stderr) {
          if (err) callback(err);
          else {
            stdout.pipe(res);
            callback(null);
          }
        });
      }
    ], function(err, result) {
      if (err) res.send({ result: 0, msg: '获取小组logo失败' });
    });

  } else {
    res.send({ result: 0, msg: '请求错误' });
  }
};

exports.managePhotoAlbum = function(req, res) {
  CompanyGroup.findOne({ _id: req.params.gid })
  .exec(function(err, company_group) {
    if (err) throw err;
    else if (company_group) {
      var photo_album_ids = [];
      company_group.photo.forEach(function(photo_album) {
        photo_album_ids.push(photo_album.pid);
      })
      PhotoAlbum.where('_id').in(photo_album_ids)
      .exec(function(err, photo_albums) {
        if (err) { console.log(err); }
        else if(photo_albums) {
          var visible_photo_albums = [];
          photo_albums.forEach(function(photo_album) {
            if (photo_album.hidden === false) {
              visible_photo_albums.push(photo_album);
            }
          });
          res.render('group/manage_photo_album',
            { owner_id : req.params.gid,
              photo_albums: visible_photo_albums
          });
        }
      });
    }
  });
}

exports.groupPhotoAlbumDetail = function(req, res) {
  PhotoAlbum.findOne({ _id: req.params.photoAlbumId })
  .exec(function(err, photo_album) {
    if (err) throw err;
    else {
      res.render('group/photo_album_detail', {
        gid: req.params.gid,
        photo_album: photo_album
      });
    }
  });
};

exports.competitionPhotoAlbumDetail = function(req, res) {
  PhotoAlbum.findOne({ _id: req.params.photoAlbumId })
  .exec(function(err, photo_album) {
    if (err) throw err;
    else {
      res.render('group/competition_photo_album_detail', {
        competition_id: req.params.competitionId,
        photo_album: photo_album
      });
    }
  });
};
