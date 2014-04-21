'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  encrypt = require('../middlewares/encrypt'),
  mail = require('../services/mail'),
  Group = mongoose.model('Group'),
  CompanyGroup = mongoose.model('CompanyGroup'),
  GroupMessage = mongoose.model('GroupMessage'),
  Campaign = mongoose.model('Campaign'),
  Provoke = mongoose.model('Provoke'),
  config = require('../config/config'),
  message = require('../language/zh-cn/message');


/**
 * Show login form
 */
exports.signin = function(req, res) {
  console.log(req.user);
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
                user.id = company.id + Date.now().toString(32) + Math.random().toString(32);
                user.save(function(err) {
                  if (err) {
                    console.log(err);
                    res.render('users/message', message.dbError);
                  }
                });
                //系统再给员工发一封激活邮件
                mail.sendStaffActiveMail(user.email, user.id, company.id);
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
          user.gid = req.body.selected;
          user.active = true;
          user.save(function(err){
            if(err){
              console.log(err);
              res.render('users/message', message.dbError);
            }
            for( var i = 0; i < user.gid.length; i ++) {
              CompanyGroup.findOne({'cid':user.cid,'gid':user.gid[i]}, function(err, company_group) {
                company_group.member.push({
                  'uid':user.id,
                  'username':user.username,
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

  for(var i = 0; i < req.user.gid.length; i ++) {
     GroupMessage.find({'cid' : {'$all':[req.user.cid]} , 'group.gid': {'$all': [req.user.gid[i]]} }, function(err, group_message) {
      flag ++;
      if (group_message.length > 0) {
        if (err) {
          console.log(err);
          return;
        } else {

          var length = group_message.length;
          for(var j = 0; j < length; j ++) {
            group_messages.push({
              'id': group_message[j].id,
              'cid': group_message[j].cid,
              'group': group_message[j].group,
              'active': group_message[j].active,
              'date': group_message[j].date,
              'poster': group_message[j].poster,
              'content': group_message[j].content,
              'provoke': group_message[j].provoke,
              'provoke_accept': group_message[j].provoke.active && (group_message[j].provoke.uid_opposite === req.session.uid) && (!group_message[j].provoke.start_confirm) ? true : false
            });
          }
        }
      }
      if(flag === req.user.gid.length) {
        res.send(group_messages);
      }
    });
  }
};


//列出该user加入的所有小组的活动
exports.getCampaigns = function(req, res) {

  var campaigns = [];
  var join = false;
  var flag = 0;
  for(var i = 0; i < req.user.gid.length; i ++) {
     Campaign.find({'cid' : {'$all':[req.user.cid]} , 'gid' : {'$all':[req.user.gid[i]]} }, function(err, campaign) {
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
              'member': campaign[j].member,
              'create_time': campaign[j].create_time ? campaign[j].create_time.toLocaleDateString() : '',
              'start_time': campaign[j].start_time ? campaign[j].start_time.toLocaleDateString() : '',
              'end_time': campaign[j].end_time ? campaign[j].end_time.toLocaleDateString() : '',
              'join':join
            });
          }
        }
      }
      if(flag === req.user.gid.length) {
        res.send(campaigns);
      }
    });
  }
};


exports.home = function(req, res) {
  if(req.user==null){
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
        for(var i=0;i<_glength;i++){
          if(group[i].gid != 0 && req.user.gid.indexOf(group[i].gid) == -1){
            _ugids.push(group[i].gid);
          }
        };
          return res.render('users/home', {'gids': req.user.gid,'ugids':_ugids});
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
//记得要做重复投票检查
exports.vote = function (req, res) {

  var cid = req.session.cid;
  var uid = req.session.uid;
  var aOr = req.body.aOr;
  var provoke_message_id = req.body.provoke_message_id;

  //由于异步方式下的多表操作有问题,所以只能在groupmessage里多添加positive和negative字段了
  GroupMessage.findOne({'id' : provoke_message_id}, function (err, group_message) {
    if (err) {
      console.log(err);
    } else {
      if (aOr) {
        group_message.provoke.vote.positive ++;
      } else {
        group_message.provoke.vote.negative ++;
      }
      group_message.save();
    }
  });

  Provoke.findOne({
    'provoke_message_id' : provoke_message_id
  },
  function (err, provoke) {
    if (provoke) {
      if (aOr) {
        provoke.vote.positive ++;
        provoke.vote.positive_member.push({'cid':cid,'uid':uid});
      } else {
        provoke.vote.negative ++;
        provoke.vote.negative_member.push({'cid':cid,'uid':uid});
      }
      provoke.save(function (err) {
        console.log(err);
      });
    } else {
      console.log('没有此约战!');
    }
  });
  res.send("ok");
};

//员工参加活动
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
        'username':req.user.username,
        'realname':req.user.username,
        'email':req.user.email,
        'phone':req.user.phone,
        'qq':req.user.qq,
        'department':req.user.department,
        'position':req.user.position,
        'sex':req.user.sex
      });
      campaign.save(function (err) {
        console.log(err);
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
  res.send("ok");
};


//获取账户信息
exports.getAccount = function (req, res) {
    User.findOne({
            id : req.session.uid
        }, function(err, user) {
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
