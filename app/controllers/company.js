'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    Company = mongoose.model('Company'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    User = mongoose.model('User'),
    UUID = require('../middlewares/uuid'),
    GroupMessage = mongoose.model('GroupMessage'),
    Campaign = mongoose.model('Campaign'),
    config = require('../config/config');

var mail = require('../services/mail');
var encrypt = require('../middlewares/encrypt');
/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

exports.signin = function(req, res) {
    res.render('company/signin', {title: '公司登录'});
};

exports.loginSuccess = function(req, res) {
    req.session.cpname = req.body.username;
    req.session.cid = req.user.id;
    res.redirect('/company/home');
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('company/company_signup', {
        title: '注册',
        company: new Company()
    });
};

exports.wait = function(req, res) {
    res.render('company/company_wait', {
        title: '等待验证'
    });
};

exports.validateError = function(req, res) {
    res.render('company/company_validate_error', {
        title: '验证错误'
    });
};


//开始转入公司注册账户页面
exports.validateConfirm = function(req, res) {
    if(req.session.company_id !== '') {
        res.render('company/validate/confirm', {
            title: '验证成功,可以进行下一步!'
        });
    } else {
        //非法进入!
    }
};

//配合路由渲染公司注册账户页面
exports.create_company_account = function(req, res) {
    res.render('company/validate/create_detail', {
        group_head: '企业',
        title: '选择组件!'
    });
};
//配合路由渲染公司选组件页面
exports.select = function(req, res) {
    res.render('company/validate/group_select', {
        group_head: '企业',
        title: '选择组件!'
    });
};
//配合路由渲染邀请链接页面
exports.invite = function(req, res) {
    var name = req.session.cpname;
    var inviteUrl = config.BASE_URL + '/users/invite?key=' + encrypt.encrypt(name, config.SECRET) + '&name=' + name;
    req.session.company_id = null;
    res.render('company/validate/invite', {
        title: '邀请链接',
        inviteLink: inviteUrl
    });
};

//显示企业小组列表
exports.groupList = function(req, res) {
    res.render('company/company_group_list', {
        title: '兴趣小组'
    });
};


//注意,company,companyGroup,entity这三个模型的数据不一定要同时保存,异步进行也可以,只要最终确保
//数据都存入三个模型即可
exports.groupSelect = function(req, res) {
    var selected_groups = req.body.selected_groups;
    if(selected_groups == undefined){
        return  res.redirect('/company/signup');
    }

    Company.findOne({id : req.session.company_id}, function(err, company) {
        if(company) {
            if (err) {
                console.log('不存在公司');
                return;
            }

            for (var i = 0, length = selected_groups.length; i < length; i++) {

                company.group.push({
                    'gid' : selected_groups[i].gid,
                    'group_type' : selected_groups[i].group_type,
                    'entity_type' : selected_groups[i].entity_type
                });

                var companyGroup = new CompanyGroup();
                companyGroup.cid = req.session.company_id;
                companyGroup.gid = selected_groups[i].gid;
                companyGroup.group_type = selected_groups[i].group_type;
                companyGroup.entity_type = selected_groups[i].entity_type;


                companyGroup.save(function (err){
                    if (err) {
                        console.log(err);
                    }
                });

                var Entity = mongoose.model(companyGroup.entity_type);//将增强组件模型引进来
                var entity = new Entity();

                //增强组件目前只能存放这两个字段
                entity.cid = req.session.company_id;
                entity.gid = selected_groups[i].gid;

                entity.save(function (err){
                    if (err) {
                        console.log(err);
                    }
                });
            }

            company.save(function (s_err){
                if(s_err){
                    console.log(s_err);
                }


            });
            res.send({'result':1,'msg':'组件选择成功！'});
        } else {

        }
    });
};



exports.validate = function(req, res) {

    var key = req.query.key;
    var _id = req.query.id;

    Company.findOne({
        id : _id
    },
    function (err, user) {
        if (user) {

            //到底要不要限制验证邮件的时间呢?
            if(encrypt.encrypt(_id,config.SECRET) === key){
                req.session.company_id = _id;
                res.redirect('/company/confirm');
            } else {
                res.render('company/company_validate_error', {
                    title: '验证失败',
                    message: '验证码不正确!'
                });
            }
        } else {
            res.render('company/company_validate_error', {
                title: '验证失败',
                message: '用户不存在!'
            });
        }
    });
};


/**
 * 创建公司基本信息
 */
exports.create = function(req, res, next) {
    var company = new Company();
    var message = null;

    company.password = UUID.id();
    company.username = UUID.id();
    company.info.name = req.body.name;
    company.info.city.province = req.body.province;
    company.info.city.city = req.body.city;
    company.info.address = req.body.address;
    company.info.linkman = req.body.contacts;
    company.info.lindline.areacode = req.body.areacode;
    company.info.lindline.number = req.body.number;
    company.info.lindline.extension = req.body.extension;
    company.info.phone = req.body.phone;
    company.id = UUID.id();//公司的id
    company.email.domain.push(req.body.domain);
    company.provider = 'company';
    company.login_email = req.body.host+'@'+req.body.domain;

    //注意,日期保存和发邮件是同步的,也要放到后台管理里去,这里只是测试需要
    company.status.date = new Date().getTime();

    company.save(function(err) {
        if (err) {
            console.log(err);
            //检查信息是否重复
            switch (err.code) {
                case 11000:
                    break;
                case 11001:
                    res.status(400).send({'result':0,'msg':'该公司已经存在!'});
                    break;
                default:
                    break;
            }
            return res.render('company/company_signup', {
                company: company
            });
        }

        //发送邮件
        //注意,这里只是测试发送邮件,正常流程是应该在平台的后台管理中向hr发送确认邮件
        mail.sendCompanyActiveMail(req.body.host+'@'+req.body.domain,req.body.name,company.id);
        res.redirect('/company/wait');
    });
};

/**
 * 验证通过后创建公司进一步的信息(用户名\密码等)
 */
exports.createDetail = function(req, res, next) {

    Company.findOne({id: req.session.company_id}, function(err, company) {
        if(company) {
            if (err) {
                console.log('错误');
            }

            company.username = req.body.username;
            company.password = req.body.password;
            company.status.active = true;

            company.save();
            req.session.cpname = req.body.username;
            req.session.role = 'HR';

            res.send({'result':1,'msg':'创建成功！'});
            //console.log('创建成功');
        } else {
            res.render('company/validate/create_detail', {
                tittle: '该公司不存在!'
            });
        }
    });
};



exports.home = function(req, res) {
    return res.render('company/home', {
        title : '公司组件和活动',
        role : req.session.role === 'EMPLOYEE'  //等加入权限功能后再修改  TODO
    });
};

exports.Info = function(req, res) {
    if(req.session.cpname != null) {
        res.render('company/company_info', {
            title: '企业信息管理'
        });
    }
    else
        res.status(403).send([]);
};

exports.getAccount = function(req, res) {
    if(req.session.cid != null) {
        Company.findOne({'id': req.session.cid}, {'_id':0,'username': 1,'login_email':1, 'register_date':1,'info':1},function(err, _company) {
            if (err) {

            }
            if(_company) {
                var _account = {
                    'login_email': _company.login_email,
                    'register_date': _company.register_date.toLocaleDateString()
                };
                return res.send({
                    'result': 1,
                    'company': _account,
                    'info': _company.info
                });
            }
            else
                return res.send({'result':0,'msg':'数据查询失败！'});
        });
    }
};

exports.saveAccount = function(req, res) {
    if(req.session.cid != null) {
        var _company = {};
        if(req.body.company!=null){
            _company = req.body.company;
        }
        else if(req.body.info!=null){
            _company.info = req.body.info;
        }
        Company.findOneAndUpdate({'id': req.session.cid}, _company,null, function(err, company) {
            if (err) {
                console.log('数据错误');
                res.send({'result':0,'msg':'数据查询错误'});
                return;
            }
            if(company) {
                res.send({'result':1,'msg':'更新成功'});
            } else {
                res.send({'result':0,'msg':'不存在该公司'});
            }
        });
    }
    else
        res.send({'result':0,'msg':'未登录'});
};

/**
 * Find company by id
 */
exports.company = function(req, res, next, id) {
    Company
        .findOne({
            _id: id
        })
        .exec(function(err, company) {
            if (err) return next(err);
            if (!company) return next(new Error('Failed to load Company ' + id));
            req.profile = company;
            next();
        });
};


//返回公司动态消息的所有数据,待前台调用
exports.getCompanyMessage = function(req, res) {

  var cid = req.session.cid;

  //公司的动态消息都归在虚拟组里
  GroupMessage.find({'cid' : {'$all':[cid]} , 'group.gid' : {'$all':[0]}}, function(err, group_messages) {
    if (err) {
      console.log(err);
      return res.status(404).send([]);
    } else {
        return res.send(group_messages);
    }
  });

};


//返回公司发布的所有活动,待前台调用
exports.getCompanyCampaign = function(req, res) {

    var cid = req.session.cid;//根据公司id取出该公司的所有活动
    var uid = req.session.uid;
    var role = req.session.role;

    //公司发布的活动都归在虚拟组 gid = 0 里
    Campaign.find({'cid' : {'$all':[cid]}, 'gid' : {'$all':[0]}}, function(err, campaign) {
        if (err) {
            console.log(err);
            return res.status(404).send([]);
        } else {
            var campaigns = [];
            var join = false;
            for(var i = 0;i < campaign.length; i ++) {
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
            return res.send({'data':campaigns,'role':role});
        }
    });
};


//任命组长
exports.appointLeader = function (req, res) {
  var leader_id = req.body.lid;
  var gid = req.body.gid;
  User
    .findOne({
        id : lid
    },function (err, user) {
      if (err) {

      } else {
        user.leader_group.gid.push(gid);
      }
    });
  CompanyGroup
  .findOne({
        gid : gid
    },function (err, company_group) {
      if (err) {

      } else {
        company_group.leader.uid.push(lid);
      }
    });
};

//关闭企业活动
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
    /*
    Campaign.findOneAndUpdate({ id: campaign_id}, { $set: { active: false }},null, function(err, company) {
        if (err) {
            console.log('数据错误');
            res.send({'result':0,'msg':'数据查询错误'});
            return;
        };
        if(company) {
            res.send({'result':1,'msg':'更新成功'});
        } else {
            res.send({'result':0,'msg':'不存在该公司'});
        }
    });
    */
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

//HR发布一个活动(可能是多个企业)
exports.sponsor = function (req, res) {

    var username = req.session.username;
    var cid = req.session.cid;    //公司id
    var uid = req.session.uid;    //用户id
    var gid = 0;                  //HR发布的活动,全部归在虚拟组里,虚拟组的id默认是0
    var group_type = '虚拟组';
    var company_in_campaign = req.body.company_in_campaign;//公司id数组,HR可以发布多个公司一起的的联谊或者约战活动,注意:第一个公司默认就是次hr所在的公司!

    if(company_in_campaign == undefined || company_in_campaign == null) {
        company_in_campaign = [cid];
    }
    var content = req.body.content;//活动内容

    var cname = '';

    Company.findOne({
            id : cid
        },
        function (err, company) {
            cname = company.info.name;
    });

    var campaign = new Campaign();

    campaign.gid.push(gid);
    campaign.group_type.push(group_type);

    campaign.cid = company_in_campaign; //参加活动的所有公司的id

    campaign.id = UUID.id();
    campaign.poster.cname = cname;
    campaign.poster.cid = cid;
    campaign.poster.uid = uid;
    campaign.poster.role = 'HR';
    campaign.active = true;

    campaign.poster.username = username;

    campaign.content = content;

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
        groupMessage.poster.role = 'HR';
        groupMessage.poster.username = username;

        groupMessage.content = content;

        groupMessage.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
        });
    });
    res.send('ok');
};

exports.changePassword = function(req, res){
    if(req.session.cid==null){
        return res.send({'result':0,'msg':'您没有登录'});
    }
    Company.findOne({
            id : req.session.cid
        },function(err, company) {
            if(err) {
                console.log(err);
                res.send({'result':0,'msg':'数据错误'});
            }
            else {
                if (company) {
                  if(company.authenticate(req.body.nowpassword)==true){
                    company.password = req.body.newpassword;
                    company.save(function(err){
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

                } else {
                res.send({'result':0,'msg':'您没有登录'});
            }
        }
    });
};


//TODO
//列出所有公司
exports.getCompany = function (req, res) {
    var companies_rst = [];
    Company.find(null, function (err, companies) {
        if(err) {
            return res.send([]);
        } else {
            if(companies) {
                for(var i = 0; i < companies.length; i ++) {
                    companies_rst.push({
                        'cid' : companies[i].id,
                        'cpname' : companies[i].info.official_name
                    });
                }
                return res.send(companies_rst);
            } else {
                return res.send([]);
            }
        }
    });
};
