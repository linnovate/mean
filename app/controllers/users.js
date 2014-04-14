'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  encrypt = require('../middlewares/encrypt'),
  mail = require('../services/mail'),
  CompanyGroup = mongoose.model('CompanyGroup'),
  GroupMessage = mongoose.model('GroupMessage'),
  Campaign = mongoose.model('Campaign'),
  config = require('../config/config'),
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
              CompanyGroup.findOne({'cid':user.cid,'gid':user.gid[i]}, function(err, company) {
                company.member.push(user.id);
                company.save(function(err){
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
     GroupMessage.find({'group.gid': {'$all': [req.user.gid[i]]} }, function(err, group_message) {
      if (group_message.length > 0) {
        if (err) {
          console.log(err);
          return;
        } else {
          flag ++;
          var length = group_message.length;
          for(var j = 0; j < length; j ++) {
            group_messages.push(group_message[j]);
          }
          if(flag === req.user.gid.length - 1) {
            res.send(group_messages);
          }
        }
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

     Campaign.find({ 'gid' : {'$all':[req.user.gid[i]]} }, function(err, campaign) {

      if(campaign.length > 0) {
        if (err) {
          console.log(err);
          return;
        } else {
          flag ++;
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
              'create_time': campaign[j].create_time,
              'start_time': campaign[j].start_time,
              'end_time': campaign[j].end_time,
              'join':join
            });

          }
          if(flag === req.user.gid.length - 1) {
            res.send(campaigns);
          }
        }
      }
    });
  }
};


exports.home = function(req, res) {
  return res.render('users/home', {gids: req.user.gid});
}

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
          return res.render('users/editInfo',
            {title: '编辑个人资料',
            user: user,
            company: company
          });
        }
      });
    }
  });
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
      campaign.member.push({'cid':cid,'uid':uid});
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
    User.findOneAndUpdate({
            id : req.session.uid
        },req.body.user,null, function(err, user) {
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

