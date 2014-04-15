'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    Company = mongoose.model('Company'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    User = mongoose.model('User'),
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

                company.gid.push(selected_groups[i].gid);
                company.group_type.push(selected_groups[i].group_type);
                var companyGroup = new CompanyGroup();
                companyGroup.cid = req.session.company_id;
                companyGroup.gid = selected_groups[i].gid;
                companyGroup.group_type = selected_groups[i].group_type;

                companyGroup.save(function (err){
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

    company.password = Date.now().toString(32) + Math.random().toString(32);
    company.username = Date.now().toString(32) + Math.random().toString(32);
    company.info.name = req.body.name;
    company.info.city.province = req.body.province;
    company.info.city.city = req.body.city;
    company.info.address = req.body.address;
    company.info.linkman = req.body.contacts;
    company.info.lindline.areacode = req.body.areacode;
    company.info.lindline.number = req.body.number;
    company.info.lindline.extension = req.body.extension;
    company.info.phone = req.body.phone;
    company.id = Date.now().toString(32) + Math.random().toString(32);//公司的id
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
    return res.render('company/home', {title : '公司组件和活动'});
};

exports.Info = function(req, res) {
    if(req.session.cpname != null) {
        res.render('company/company_info', {
            title: '企业信息管理'
        });
    }
    else
        res.redirect('/company/signin');
};

exports.getAccount = function(req, res) {
    if(req.session.cid != null) {
        Company.findOne({'id': req.session.cid}, {"_id":0,"username": 1,"login_email":1, "register_date":1,"info":1},function(err, _company) {
            if (err) {

            }
            if(_company) {
                var _account = {
                    'username': _company.username,
                    'login_email': _company.login_email,
                    'register_date': _company.register_date
                }
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
            };
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
  GroupMessage.find({'poster.cid' : cid , 'group.gid' : {'$all':[0]}}, function(err, group_messages) {
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

    var cid = req.session.cid;//根据公司id取出该公司的所有活动(公司id是参数传进来的)
    var uid = req.session.uid;

    //公司发布的活动都归在虚拟组 gid = 0 里
    Campaign.find({'poster.cid' : cid, 'gid' : {'$all':[0]}}, function(err, campaign) {
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
                    'id': campaign[i].gid,
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

//HR发布一个活动(可能是多个企业)
exports.sponsor = function (req, res) {

    var username = req.session.username;
    var cid = req.session.cid;    //公司id
    var uid = req.session.uid;    //用户id
    var gid = 0;                  //HR发布的活动,全部归在虚拟组里,虚拟组的id默认是0
    var group_type = '虚拟组';
    var company_in_campaign = req.body.company_in_campaign;//公司id数组,HR可以发布多个公司一起的的联谊或者约战活动,注意:第一个公司默认就是次hr所在的公司!

    if(company_in_campaign == undefined) {
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

    campaign.cid = company_in_campaign; //一定要和cid区分开啊,这是参加活动的所有公司的id

    campaign.id = Date.now().toString(32) + Math.random().toString(32) + '0';
    campaign.poster.cname = cname;
    campaign.poster.cid = cid;
    campaign.poster.uid = uid;
    campaign.poster.role = 'HR';
    campaign.active = true;

    campaign.poster.username = username;

    campaign.content = content;

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
        groupMessage.group.group_type.push(group_type);
        groupMessage.group.active = true,
        groupMessage.group.date = req.body.create_time,

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
    res.send("ok");
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
}
