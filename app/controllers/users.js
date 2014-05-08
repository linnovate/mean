'use strict';

/**
 * Module dependencies.
 */

// node system
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

// mongoose and models
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  Group = mongoose.model('Group'),
  CompanyGroup = mongoose.model('CompanyGroup'),
  GroupMessage = mongoose.model('GroupMessage'),
  Campaign = mongoose.model('Campaign'),
  Competition = mongoose.model('Competition');

// 3rd
var validator = require('validator'),
  async = require('async'),
  gm = require('gm').subClass({ imageMagick: true });

// custom
var encrypt = require('../middlewares/encrypt'),
  mail = require('../services/mail'),
  UUID = require('../middlewares/uuid'),
  config = require('../config/config'),
  meanConfig = require('../../config/config'),
  message = require('../language/zh-cn/message');


/**
 * Show login form
 */
exports.signin = function(req, res) {
  if(req.user) {
    res.redirect('/users/home');
  } else {
    res.render('users/signin', {
      title: 'Signin',
      message: req.flash('error')
    });
  }
};

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */
exports.loginSuccess = function(req, res) {
  req.session.username = req.body.username;
  req.session.cid = req.user.cid;
  req.session.uid = req.user.id;
  req.session.role = req.user.role;

  res.redirect('/users/home');
};

exports.authorize = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/users/signin');
  }
};


/**
 * 通过邀请链接进入激活流程
 */
exports.invite = function(req, res) {
  var key = req.query.key;
  var name = req.query.name;
  if(key == undefined || name == undefined) {
    res.render('users/message', {title: 'error', message: 'bad request'});
  } else {
    if (encrypt.encrypt(name, config.SECRET) === key) {
      req.session.key = key;
      req.session.name = name;
      res.render('users/invite', {
        title: 'validate'
      });
    }
  }
};

/**
 * 处理激活验证
 */
exports.dealActive = function(req, res) {
  var key = req.session.key;
  var name = req.session.name;

  User.findOne({username: req.body.host + '@' + req.body.domain}, function(err, user) {
    if(err) {
      console.log(err);
    } else if(user) {
      if(user.active === false) {
        res.render('users/message', message.registered);
      } else {
        res.render('users/message', message.actived);
      }
    } else {
      if(encrypt.encrypt(name, config.SECRET) === key) {
        Company.findOne({'username': name}).exec(function(err, company){
          if (company != null) {
            for(var i = 0; i < company.email.domain.length; i++) {
              if(req.body.domain === company.email.domain[i]) {
                var user = new User();
                user.email = req.body.host + '@' + req.body.domain;
                user.username = user.email;
                user.cid = company.id;
                user.id = UUID.id();
                user.save(function(err) {
                  if (err) {
                    console.log(err);
                    res.render('users/message', message.dbError);
                  }
                });
                //系统再给员工发一封激活邮件
                mail.sendStaffActiveMail(user.email, user.id, company.id, req.headers.host);
                res.render('users/message', message.wait);
                return;
              }
            }
            res.render('users/message', message.emailError);
          } else {
            res.render('users/message', message.invalid);
          }
        });
      } else {
        res.render('users/message', message.invalid);
      }
    }

  });
};

/**
 * 通过激活链接进入，完善个人信息
 */
exports.setProfile = function(req, res) {
  var key = req.query.key;
  var uid = req.query.uid;
  User.findOne({id: uid}, function(err, user) {
    if(err) {
      console.log(err);
      res.render('users/message', message.dbError);
    } else if(user) {
      if(user.active === true) {
        res.render('users/message', message.actived);
      } else {
        req.session.cid = req.query.cid;
        if(encrypt.encrypt(uid, config.SECRET) === key) {
          res.render('users/setProfile', {
            title: '设置个人信息',
            key: key,
            uid: uid
          });
        } else {
          res.render('users/message', message.invalid);
        }
      }
    } else {
      res.render('users/message', message.unregister);
    }
  });
};

/**
 * 处理个人信息表单
 */
exports.dealSetProfile = function(req, res) {
  User.findOne(
    {id : req.query.uid}
  , function(err, user) {
    if(err) {
      console.log(err);
      res.render('users/message', message.dbError);
    }
    else {
      if(user) {
        if(user.active === false) {
          user.nickname = req.body.nickname;
          user.password = req.body.password;
          user.realName = req.body.realName;
          user.department = req.body.department;
          user.phone = req.body.phone;
          user.role = 'EMPLOYEE';

          user.save(function(err) {
            if(err) {
              console.log(err);
              res.render('users/message', message.dbError);
            }
            req.session.username = user.username;
            res.redirect('/users/selectGroup');
          });
        } else {
          res.render('users/message', message.actived);
        }
      } else {
        res.render('users/message', message.unregister);
      }
    }
  });

};

/**
 * 选择组件页面
 */
exports.selectGroup = function(req, res) {
  User.findOne({username: req.session.username}, function(err, user) {
    if(err) {
      console.log(err);
      res.render('users/message', message.dbError);
    } else if(user) {
      if(user.active === true) {
        res.render('users/message', message.actived);
      } else {
        res.render('users/selectGroup', {title: '选择你的兴趣小组', group_head: '个人'});
      }
    } else {
      res.render('users/message', message.unregister);
    }
  });
}

/**
 * 处理选择组件表单
 */
exports.dealSelectGroup = function(req, res) {
  if(req.body.selected == undefined) {
    return res.redirect('/users/selectGroup');
  }
  User.findOne({'username': req.session.username}, function(err, user) {
    if(user) {
      if (err) {
        res.status(400).send('用户不存在!');
        return;
      } else if(user) {
        if(user.active === false) {

          user.group = req.body.selected;

          user.active = true;
          user.save(function(err){
            if(err){
              console.log(err);
              res.render('users/message', message.dbError);
            }
            for( var i = 0; i < user.group.length; i ++) {
              CompanyGroup.findOne({'cid':user.cid,'gid':user.group[i].gid}, function(err, company_group) {
                company_group.member.push({
                  'cid':user.cid,
                  'uid':user.id,
                  'username':user.username,
                  'email':user.email,
                  'phone':user.phone,
                  'number':0                     //个人队号暂定为0,到时由队长统一修改
                });
                company_group.save(function(err){
                  if(err){
                    console.log(err);
                  }
                });
              });
            }
          });
          res.redirect('/users/finishRegister');
        } else {
          res.render('users/message', message.actived);
        }
      }
    } else {
      res.render('users/message', message.unregister);
    }
  });
};

/**
 * 完成注册
 */
exports.finishRegister = function(req, res) {
  res.render('users/message', {title: '激活成功', message: '激活成功'});
};


//列出该user加入的所有小组的动态
exports.getGroupMessages = function(req, res) {
  var group_messages = [];
  var flag = 0;
  console.log(req.session.role);
  for(var i = 0; i < req.user.group.length; i ++) {
     GroupMessage.find({'cid' : {'$all':[req.user.cid]} , 'group.gid': {'$all': [req.user.group[i].gid]} }, function(err, group_message) {
      flag ++;
      if (group_message.length > 0) {
        if (err) {
          console.log(err);
          return;
        } else {

          var length = group_message.length;
          for(var j = 0; j < length; j ++) {

            var positive = 0;
            var negative = 0;
            console.log(req.session.companyGroup);
            for(var k = 0; k < group_message[j].provoke.camp.length; k ++) {
              if(group_message[j].provoke.camp[k].tname === req.session.companyGroup.name){
                positive = group_message[j].provoke.camp[k].vote.positive;
                negative = group_message[j].provoke.camp[k].vote.negative;
                break;
              }
            }
            group_messages.push({
              'positive' : positive,
              'negative' : negative,
              'my_tname': req.user.group[flag-1].tname,
              'id': group_message[j].id,
              'cid': group_message[j].cid,
              'group': group_message[j].group,
              'active': group_message[j].active,
              'date': group_message[j].date,
              'poster': group_message[j].poster,
              'content': group_message[j].content,
              'location' : group_message[j].location,
              'start_time' : group_message[j].start_time ? group_message[j].start_time.toLocaleDateString() : '',
              'end_time' : group_message[j].end_time ? group_message[j].end_time.toLocaleDateString() : '',
              'provoke': group_message[j].provoke,                  //应约按钮显示要有四个条件:1.该约战没有关闭 2.当前员工公司id和被约公司id一致 3.约战没有确认 4.当前员工是该小队的队长
              'provoke_accept': group_message[j].provoke.active && (group_message[j].group.gid[0] === req.user.group[flag-1].gid) && (!group_message[j].provoke.start_confirm) && req.user.group[flag-1].leader && (group_message[j].cid[1] === req.session.cid)
            });
          }
        }
      }
      if(flag === req.user.group.length) {
        res.send(group_messages);
      }
    });
  }
};


//列出该user加入的所有小组的活动
//这是在员工日程里的,不用判断权限,因为关闭活动等操作
//必须让队长进入小队页面去完成,不能在个人页面进行
exports.getCampaigns = function(req, res) {

  var campaigns = [];
  var join = false;
  var flag = 0;
  for(var i = 0; i < req.user.group.length; i ++) {
     Campaign.find({'cid' : {'$all':[req.user.cid]} , 'gid' : {'$all':[req.user.group[i].gid]} }, function(err, campaign) {
      flag ++;
      if(campaign.length > 0) {
        if (err) {
          console.log(err);
          return;
        } else {
          var length = campaign.length;
          for(var j = 0; j < length; j ++) {
            join = false;
            for(var k = 0;k < campaign[j].member.length; k ++) {
              if(req.user.id === campaign[j].member[k].uid) {
                join = true;
                break;
              }
            }
            campaigns.push({
              'active':campaign[j].active,
              'id': campaign[j].id,
              'gid': campaign[j].gid,
              'group_type': campaign[j].group_type,
              'cid': campaign[j].cid,
              'cname': campaign[j].cname,
              'poster': campaign[j].poster,
              'content': campaign[j].content,
              'location': campaign[j].location,
              'member': campaign[j].member,
              'create_time': campaign[j].create_time ? campaign[j].create_time.toLocaleDateString() : '',
              'start_time': campaign[j].start_time ? campaign[j].start_time.toLocaleDateString() : '',
              'end_time': campaign[j].end_time ? campaign[j].end_time.toLocaleDateString() : '',
              'join':join,
              'provoke':campaign[j].provoke
            });
          }
        }
      }
      if(flag === req.user.group.length) {
        res.send({
          'data':campaigns
        });
      }
    });
  }
};


exports.home = function(req, res) {
  if(req.user === null){
    return res.redirect('/users/signin');
  }
  else{
    Group.find(null,function(err,group){
      if (err) {
        console.log(err);
        return res.status(404).send();;
      };
      var _ugids = [];
      var _glength = group.length;
      var tmp_gid = [];
      for(var j=0;j<req.user.group.length;j++){
        tmp_gid.push(req.user.group[j].gid);
      }
      for(var i=0;i<_glength;i++){
        if(group[i].gid != 0 && tmp_gid.indexOf(group[i].gid) == -1){
          _ugids.push(group[i].gid);
        }
      };

      return res.render('users/home', {'groups': req.user.group, 'ugids':_ugids, photo: req.user.photo});
    });

  }
};

exports.editInfo = function(req, res) {
  User.findOne({
    id: req.user.id
  },
  function (err, user) {
    if(err) {
      console.log(err);
    } else if(user) {
      Company.findOne({
        id: user.cid
      },
      function(err, company) {
        if(err) {
          console.log(err);
        } else if(company) {
          user.register_date = user.register_date.toLocaleString();
          console.log(user.register_date.toLocaleString());
          return res.render('users/editInfo',
            {'title': '编辑个人资料',
            'user': user,
            'company': company
          });
        }
      });
    }
  });
};


//员工投票是否参加约战
//记得要做重复投票检查 TODO
exports.vote = function (req, res) {

  var cid = req.session.cid;
  var uid = req.session.uid;
  var aOr = req.body.aOr;
  var provoke_message_id = req.body.provoke_message_id;

  Competition.findOne({
    'provoke_message_id' : provoke_message_id
  },
  function (err, competition) {
    if (competition) {

      for(var j = 0; j < competition.camp.length; j ++) {
        if(competition.camp[j].cid === cid) {
          for(var i = 0; i < competition.camp[j].vote.positive_member.length; i ++) {
            if(competition.camp[j].vote.positive_member[i].uid === uid) {
              console.log('positive');
              return res.send({
                'msg':'已经投过票!'
              });
            }
          }

          for(var i = 0; i < competition.camp[j].vote.negative_member.length; i ++) {
            if(competition.camp[j].vote.negative_member[i].uid === uid) {
              console.log('negative');
              return res.send({
                'msg':'已经投过票!'
              });
            }
          }


          if (aOr) {
            competition.camp[j].vote.positive ++;
            competition.camp[j].vote.positive_member.push({'cid':cid,'uid':uid});
          } else {
            competition.camp[j].vote.negative ++;
            competition.camp[j].vote.negative_member.push({'cid':cid,'uid':uid});
          }
          break;
        }
      }

      competition.save(function (err) {
        if(err) {
          return res.send('ERROR');
        } else {
          //由于异步方式下的多表操作有问题,所以只能在groupmessage里多添加positive和negative字段了
          GroupMessage.findOne({'id' : provoke_message_id}, function (err, group_message) {
            if (err || !group_message) {
              console.log(err);
              return res.send('ERROR');
            } else {

              var positive,negative;
              for(var i = 0; i < group_message.provoke.camp.length; i ++) {
                if(group_message.provoke.camp[i].cid === cid) {
                  if (aOr) {
                    group_message.provoke.camp[i].vote.positive ++;
                    positive = group_message.provoke.camp[i].vote.positive;
                  } else {
                    group_message.provoke.camp[i].vote.negative ++;
                    negative = group_message.provoke.camp[i].vote.negative;
                  }
                  break;
                }
              }
              group_message.save(function (err){
                if(err) {
                  return res.send('ERROR');
                } else {
                  return res.send({
                    'positive' : positive,
                    'negative' : negative
                  });
                }
              });
            }
          });
        }
      });
    } else {
      console.log('没有此约战!');
      return res.send('NULL');
    }
  });
};

//员工参加活动
//TODO 加入competition
exports.joinCampaign = function (req, res) {
  var cid = req.session.cid;
  var uid = req.session.uid;
  var campaign_id = req.body.campaign_id; //该活动的id
  Campaign.findOne({
    id : campaign_id
  },
  function (err, campaign) {
    if (campaign) {
        campaign.member.push({
          'cid':cid,
          'uid':uid,
          'username':req.user.username
        });
        campaign.save(function (err) {
          if(err) {
            console.log(err);
            res.send(err);
          } else {
            if(campaign.provoke.active === true) {
              //将员工信息存入competition,要根据他的队名判断属于哪一方
              Competition.findOne({'id':campaign.provoke.competition_id}, function (err, competition) {
                if(err){
                  return res.send(err);
                } else {
                  if(competition) {
                    for(var i = 0;i < req.user.group.length; i ++) {
                      if(competition.camp[0].tname === req.user.group[i].tname) {
                          competition.camp[0].member.push({
                             camp:'A',
                             cid: cid,
                             uid: uid,
                             photo: req.user.photo,                 //队员头像路径
                             username: req.user.username,
                             number: 0                             //球队分配的个人号码
                          });
                        break;
                      }
                      if(competition.camp[1].tname === req.user.group[i].tname) {
                          competition.camp[1].member.push({
                              camp:'B',
                              cid: cid,
                              uid: uid,
                              photo: req.user.photo,                //队员头像路径
                              username: req.user.username,
                              number: 0                             //球队分配的个人号码
                          });
                        break;
                      }
                    }
                    competition.save(function (err) {
                      if(err) {
                        return res.send(err);
                      } else {
                        return res.send('ok');
                      }
                    });
                  } else {
                    return res.send('null');
                  }
                }
              });
            }
          }
        });
    } else {
      console.log('没有此活动!');
    }
  });
  res.send("ok");
};


//员工退出活动
exports.quitCampaign = function (req, res) {
  var cid = req.session.cid;
  var uid = req.session.uid;
  var campaign_id = req.body.campaign_id; //该活动的id
  Campaign.findOne({
        id : campaign_id
    },
    function (err, campaign) {
      if (campaign) {

        //从campaign里删除该员工信息
        for( var i = 0; i < campaign.member.length; i ++) {
          if (campaign.member[i].uid === uid) {
            campaign.member.splice(i,1);
            break;
          }
        }

        campaign.save(function (err) {
          if(err){
            return res.send(err);
          } else {
            if(campaign.provoke.active === true) {
              //将员工信息从competition里删除
              Competition.findOne({'id':campaign.provoke.competition_id}, function (err, competition) {
                if(err){
                  return res.send(err);
                } else {
                  if(competition) {
                    var find = false;

                    //看该员工是不是在camp[0]里面
                    for(var i = 0; i < competition.camp[0].member.length; i++) {
                      if (competition.camp[0].member[i].uid === uid) {
                        competition.camp[0].member.splice(i,1);
                        find = true;
                        break;
                      }
                    }
                    //如果不在camp[0]里面就一定在camp[1]里面
                    if(!find) {
                      for(var i = 0; i < competition.camp[1].member.length; i++) {
                        if (competition.camp[1].member[i].uid === uid) {
                          competition.camp[1].member.splice(i,1);
                          find = true;
                          break;
                        }
                      }
                    }
                    competition.save(function (err) {
                      if(err) {
                        return res.send(err);
                      } else {
                        return res.send('ok');
                      }
                    });
                  } else {
                    return res.send('null');
                  }
                }
              });
            }
          }
        });
      } else {
          console.log('没有此活动!');
      }
    });
  res.send("ok");
};


//获取账户信息
exports.getAccount = function (req, res) {
    User.findOne({
            id : req.session.uid
        },{'_id':0,'hashed_password':0,'salt':0}, function(err, user) {
            if(err) {
                console.log(err);
                res.send({'result':0,'msg':'数据错误'});
            }
            else {
                if (user) {
                    res.send({'result':1,'msg':'用户查找成功','data': user});
                } else {
                    res.send({'result':0,'msg':'不存在该用户'});
                }
            }
        });
};

//保存用户信息
exports.saveAccount = function (req, res) {
    User.findOneAndUpdate({
            id : req.session.uid
        }, req.body.user,null,function(err, user) {
            if(err) {
                console.log(err);
                res.send({'result':0,'msg':'数据错误'});
            }
            else {
                if (user) {
                    res.send({'result':1,'msg':'修改成功'});
                } else {
                    res.send({'result':0,'msg':'不存在该用户'});
                }
            }
        });
};

//修改密码
exports.changePassword = function (req, res) {
  if(req.user.id==null){
      return res.send({'result':0,'msg':'您没有登录'});
  }
  User.findOne({
      id : req.session.uid
    },function(err, user) {
      if(err) {
        console.log(err);
        res.send({'result':0,'msg':'数据错误'});
      }
      else {
        if (user) {
          if(user.authenticate(req.body.nowpassword)==true){
            user.password = req.body.newpassword;
            user.save(function(err){
              if(err){
                console.log(err);
                res.send({'result':0,'msg':'密码修改失败'});
              }
              else {
                res.send({'result':1,'msg':'密码修改成功'});
              }
              return;
            });
          }
          else{
            res.send({'result':0,'msg':'密码不正确，请重新输入'});
          }
        }
        else {
          res.send({'result':0,'msg':'您没有登录'});
        }
      }
    });
};

exports.tempPhoto = function(req, res) {

  var temp_path = req.files.temp_photo.path;

  var target_dir = meanConfig.root + '/public/img/user/photo/temp/';
  if (!fs.existsSync(target_dir)) {
    fs.mkdirSync(target_dir);
  }

  var shasum = crypto.createHash('sha1');

  // 临时图片，以加密的用户名命名，以避免将临时路径存入数据库。
  shasum.update(req.user.username);
  var target_img = shasum.digest('hex') + '.png';
  var target_path = target_dir + target_img;

  var gm = require('gm').subClass({ imageMagick: true });
  gm(temp_path)
  .write(target_path, function(err) {
    if (err) console.log(err);
    fs.unlink(temp_path, function(err) {
      if (err) console.log(err);
      res.send({ img: target_img });
    });
  });

};

exports.savePhoto = function(req, res) {
  var fs = require('fs');
  var user = req.user;

  var shasum = crypto.createHash('sha1');

  shasum.update(req.user.username);
  var temp_img = shasum.digest('hex') + '.png';

  // 存入数据库的文件名，以当前时间的加密值命名

  var shasum = crypto.createHash('sha1');
  shasum.update( Date.now().toString() + Math.random().toString() );
  var photo = shasum.digest('hex') + '.png';


  // 文件系统路径，供fs使用
  var temp_path = meanConfig.root + '/public/img/user/photo/temp/' + temp_img;
  var target_dir = meanConfig.root + '/public/img/user/photo/';

  // uri路径，存入数据库的路径，供前端访问
  var uri_dir = '/img/user/photo/';

  var gm = require('gm').subClass({ imageMagick: true });

  gm(temp_path).size(function(err, value) {
    if (err) console.log(err);

    // req.body参数均为百分比
    var w = req.body.width * value.width;
    var h = req.body.height * value.height;
    var x = req.body.x * value.width;
    var y = req.body.y * value.height;

    // 在保存新路径前，将原路径取出，以便删除旧文件
    var ori_photo = user.photo;

    gm(temp_path)
    .crop(w, h, x, y)
    .resize(150, 150)
    .write(target_dir + photo, function(err) {
      if (err) {
        console.log(err);
        res.redirect('/users/editPhoto');
      }
      else {
        user.photo = uri_dir + photo;
        user.save(function(err) {
          if (err) {
            console.log(err);
            res.redirect('/users/editPhoto');
          }
        });

        fs.unlink(temp_path, function(err) {
          if (err) {
            console(err);
            res.redirect('/users/editPhoto');
          }
          var unlink_dir = meanConfig.root + '/public';
          if (ori_photo !== '/img/user/photo/default.png') {
            if (fs.existsSync(unlink_dir + ori_photo)) {
              fs.unlinkSync(unlink_dir + ori_photo);
            }
          }
          res.redirect('/users/editPhoto');
        });
      }
    });

  });

};

exports.editPhoto = function(req, res) {
  res.render('users/editPhoto', {
    photo: req.user.photo,
    uid: req.user.id
  });
};


exports.getPhoto = function(req, res) {
  var uid = req.params.id;
  var width = req.params.width;
  var height = req.params.height;
  if (validator.isNumeric(width + height)) {
    async.waterfall([
      function(callback) {
        User.findOne({ id: uid })
        .exec(function(err, user) {
          if (err) callback(err);
          else callback(null, user.photo);
        });
      },
      function(photo, callback) {
        res.set('Content-Type', 'image/png');
        gm(meanConfig.root + '/public' + photo)
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
      if (err) res.send({ result: 0, msg: '获取用户头像失败' });
    });

  } else {
    res.send({ result: 0, msg: '请求错误' });
  }
}

//搜索成员
//目前只是将所有记录都列出来
//TODO
exports.getUser = function(req, res, cid) {
  var cid = cid;   //根据公司名找它的员工
  User.find({'cid': cid}, function (err, users){
    if(err){
      return [];
    }else{
      if(users){
        //数据量会不会太大?或许只需要员工的部分信息?
        return users;
      } else {
        return [];
      }
    }
  });
};

