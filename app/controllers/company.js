'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    Company = mongoose.model('Company'),
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
    req.session.cpusername = req.body.username;
    res.redirect('/');
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
    if(req.session.company_validate != '') {
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
    var name = req.session.user;
    var inviteUrl = config.BASE_URL + '/users/invite?key=' + encrypt.encrypt(name, config.SECRET) + '&name=' + name;
    res.render('company/validate/invite', {
        title: '邀请链接',
        inviteLink: inviteUrl
    });
};


exports.groupSelect = function(req, res) {
    if(req.body.item == undefined){
        return  res.redirect('/company/signup');
    }
    console.log('session' + req.session.company_validate);
     Company.findOne({id : req.session.company_validate}, function(err, _body) {
        if(_body) {
            if (err) {
                console.log('不存在公司');
                return;
            }
            _body.main.team_info = req.body.item;
            //console.log(_body.main.team_info);
            _body.save(function(s_err){
                if(s_err){
                    console.log(s_err);
                }

                res.send('ok');
            });
        } else {
            ;
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
            if(encrypt.encrypt(_id,'18801912891') === key){
                req.session.company_validate = _id;
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

    company.info.name = req.body.name;
    company.info.city.province = req.body.province;
    company.info.city.city = req.body.city;
    company.info.address = req.body.address;
    company.info.linkman = req.body.contacts;
    company.info.lindline.areacode = req.body.areacode;
    company.info.lindline.number = req.body.number;
    company.info.lindline.extension = req.body.extension;
    company.info.phone = req.body.phone;
    company.id = encrypt.valueEncrypt(req.body.phone);//公司的id就是hr的手机的加密

    company.provider = 'company';

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
        //注意,这里只是测试发送邮件,正常流程是应该在平台的后台管理中向hr发送确认邮件
        mail.sendCompanyActiveMail(req.body.host+'@'+req.body.domain,req.body.name,company.id);
        

        res.redirect('/company/wait');
    });
};

/**
 * 验证通过后创建公司进一步的信息(用户名\密码等)
 */
exports.createDetail = function(req, res, next) {

    Company.findOne({id: req.session.company_validate}, function(err, _body) {
        if(_body) {
            if (err) {
                console.log('错误');
            }

            _body.username = req.body.username;
            _body.password = req.body.password;
            _body.status.active = true;

            _body.save();
            req.session.user = req.body.username;
            req.session.role = 'M';

            res.send('ok');
            //console.log('创建成功');
            
        } else {
            res.render('company/validate/create_detail', {
                tittle: '该公司不存在!'
            });
        }
    });
};




exports.editInfo = function(req, res){
    if(req.session.company_validate != '') {
        res.render('company/edit_info', {
            title: '企业信息管理'
        });
    } else {
        //非法进入!
    }
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
