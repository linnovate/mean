'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Company = mongoose.model('Company');

var mail = require('../services/mail');
/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
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

exports.validateConfirm = function(req, res) {
    res.render('company/validate/confirm', {
        title: '验证成功,可以进行下一步!'
    });
};

exports.groupSelect = function(req, res) {
    if(req.body.selected==undefined){
        return  res.redirect('/company/signup');
    }
     Company.findOne({'info.name': req.session.company_validate}, function(err, _body) {
        if(_body) {
            if (err) {
                res.status(400).send('该公司信息不存在!');
                return;
            }
            _body.main.team_info = req.body.selected;
            _body.save();
            res.render('company/validate/send_invate_code', {
                message: '发送邀请码'
            });
        } else {
            res.render('company/validate/confirm', {
                tittle: '该公司不存在!'
            });
        }
    });
    
};

exports.sendInvateCode = function(req, res) {
    res.render('company/validate/send_invate_code', {
        message: '发送邀请码'
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
    company.info.linkman = req.body.linkman;
    company.info.lindline.areacode = req.body.areacode;
    company.info.lindline.number = req.body.number;
    company.info.lindline.extension = req.body.extension;
    company.info.phone = req.body.phone;
    company.email.host = req.body.host;
    company.email.domain[0] = req.body.domain;

    company.provider = 'local';
    company.save(function(err) {
        if (err) {
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
    });
};


/**
 * 验证通过后创建公司进一步的信息(用户名\密码等)
 */
exports.createDetail = function(req, res, next) {

    Company.findOne({'info.name': req.session.company_validate}, function(err, _body) {
        if(_body) {
            if (err) {
                res.status(400).send('该公司信息不存在!');
                return;
            }
        
            _body.username = req.body.username;
            _body.password = req.body.password;

            _body.save();
            req.session.user = req.body.username;
            req.session.role = 'MANAGER';
            //hr进入公司组件选择界面

            res.render('company/validate/group_select',{
                group_head : '企业'
            });
        } else {
            res.render('company/validate/confirm', {
                tittle: '该公司不存在!'
            });
        }
    });
};

/**
 * Send Company
 */
exports.me = function(req, res) {
    res.jsonp(req.company || null);
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
