'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    UUID = require('../middlewares/uuid'),
    Competition = mongoose.model('Competition'),
    GroupMessage = mongoose.model('GroupMessage'),
    Company = mongoose.model('Company'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    PhotoAlbum = mongoose.model('PhotoAlbum'),
    Arena = mongoose.model('Arena'),
    fs = require('fs'),
    meanConfig = require('../../config/config');
exports.home = function(req, res) {
  Arena.find({'gid':req.session.gid},function(err,arenas){
      if (err) {
          console.log(err);
          return res.status(400).send([]);
      }
      console.log(arenas);
      res.render('arena/arena_list', {'title': '擂台列表','arenas': arenas});
  });
};
exports.detail = function(req, res){
  console.log(req.arena);
  res.render('arena/arena_detail', {'title': '擂台详情','arena': req.arena,'champion_flag': req.arena.champion.uid===req.session.uid,'alert_flag':req.arena.champion.cid!==null&&req.arena.champion.active===false && req.arena.champion.uid===req.session.uid});
};
exports.rob = function(req, res){
  if(!req.arena.champion.cid){
    Arena.findOne({
        id: req.params.arenaId
    },function(err,arena){
      if(err){
        console.log(err);
        return res.send({'result':0,'msg':'擂台查询失败！'});
      }
      if(arena){
        Company.findOne({'id': req.session.cid},function(err, company){
          if (err) {
            console.log(err);
            return res.send({'result':0,'msg':'您没有权限抢擂'});
          }
          if (company) {
            var _end_time = new Date();
            _end_time.setMinutes(new Date().getMinutes()+30);
            arena.champion= {
              'cid': req.session.cid,
              'cname':company.username,
              'gid': req.session.companyGroup.gid,
              'uid': req.session.uid,
              'username':req.user.username,
              'tname':req.session.companyGroup.name,
              'champion_type':'rob',
              'active': false,
              'start_time': new Date(),
              'end_time': _end_time
            };
            arena.save(function(err){
              if(!err){
                return res.send({'result':1,'msg':'抢擂成功,请在半个小时内填写擂台信息，否则自动取消擂主资格！'});
              }
              else{
                console.log(err);
              }
            });
          }
          else{
            return res.send({'result':0,'msg':'您没有权限抢擂'});
          }
        });
      }
      else{
        res.send({'result':0,'msg':'抢擂失败'});
      }
    });
  }
  else{
    res.send({'result':0,'msg':'已被他人抢擂'});
  }
};

exports.addCampaignInfo = function(req, res){
  if(req.arena.champion.uid===req.session.uid){
    if(req.body.campaign_info.number===null || req.body.campaign_info.competition_date===null){
      return res.send({'result':0,'msg':'挑战信息不完整'});
    }
    console.log(req.body.campaign_info);
    Arena.findOne({'id':req.params.arenaId},function(err,arena){
      if (err) {
          console.log(err);
          return res.send({'result':0,'msg':'无此擂台信息'});
      }
      else if(arena) {
        arena.campaign_info = req.body.campaign_info;
        arena.champion.active = true;
        console.log(arena);
        arena.save(function(err){
          if(err){
            console.log(err);
          }
          else{
            res.send({'result':1,'msg':'挑战信息已提交成功！'});
          }
        });
      }
    });
  }
  else{
    res.send({'result':0,'msg':'您没有权限修改挑战信息！'});
  }
};
exports.challenge = function(req, res){
  if(req.arena.champion.uid!==req.session.uid){
    var uid = req.session.uid;
    var username = req.session.username;
    var cid =req.session.cid;
    var cid_opposite = req.arena.champion.cid;       //被约方公司id(如果是同一家公司那么cid_b = cid_a)
    var gid = req.session.gid;         //约战小组id

    var content = req.arena.campaign_info.content;
    var competition_format = req.arena.campaign_info.competition_format;
    var location = req.arena.campaign_info.location.name;
    var competition_date = req.arena.campaign_info.competition_date;
    var deadline = req.arena.campaign_info.deadline;
    var remark = req.arena.campaign_info.remark;
    var number = req.arena.campaign_info.number;

    var competition = new Competition();


    var team_a = req.session.companyGroup.name;   //约战方队名
    var team_opposite = req.arena.champion.tname;   //被约方队名

    competition.id = UUID.id();
    competition.gid = gid;
    competition.group_type = req.session.companyGroup.group_type;

    competition.camp.push({
      'cid' : cid,
      'start_confirm' : true,
      'tname' : team_a,
      'logo' : req.session.companyGroup.logo
    });
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

          competition.camp.push({
            'cid' : cid_opposite,
            'tname' : team_opposite,
            'logo' : company_group.logo
          });

          competition.content = content;
          competition.brief.remark = remark;
          competition.brief.location.name = location;
          competition.brief.competition_date = competition_date;
          competition.brief.deadline = deadline;
          competition.brief.competition_format = competition_format;
          competition.brief.number = number;

          var groupMessage = new GroupMessage();
          groupMessage.id = UUID.id();
          groupMessage.group.gid.push(gid);
          groupMessage.group.group_type.push(competition.group_type);
          groupMessage.provoke.active = true;
          groupMessage.provoke.team =[];
          groupMessage.provoke.team.push({
          'cid':cid,
          'tname':team_a
        });
          groupMessage.provoke.team.push({
          'cid':cid_opposite,
          'tname':team_opposite
        });

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
          groupMessage.location = location;
          groupMessage.start_time = competition_date;
          groupMessage.end_time = deadline;

          groupMessage.save(function (err) {
            if (err) {
              console.log('保存约战动态时出错' + err);
              return res.send(err);
            } else {
              competition.provoke_message_id = groupMessage.id;
              competition.save(function(err){
                if(err){
                  console.log(err);
                }
                Arena.findOne({
                  id: req.params.arenaId
                },function(err, arena) {
                  if(arena){
                    if(!arena.competition_id){
                      arena.competition_id = [];
                    }
                    arena.competition_id.push(competition.id);
                    arena.save(function(err){
                      if(err){
                        return res.send({'result':0,'msg':'保存失败！'});
                      }
                      return res.send({'result':1,'msg':'挑战成功！'});
                    });
                  }
                });
              });
            }
            //这里要注意一下,生成动态消息后还要向被约队长发一封私信
          });
        }
        else {
          return res.send({'result':0,'msg':'未查到对方小组！'});
        }
      }
    });
  }
  else{
    res.send({'result':0,'msg':'无法挑战自己'});
  }
};
exports.arena = function(req, res, next, id){
    Arena
        .findOne({
            id: id
        })
        .exec(function(err, arena) {
            if (err) return next(err);
            if (!arena) return next(new Error('Failed to load arena ' + id));
            req.arena = arena;
            next();
        });
};
