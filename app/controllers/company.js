'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Company = mongoose.model('Company');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('company/company_signin', {
        title: '登录',
        message: req.flash('error')
    });
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
exports.session = function(req, res) {
    Company.findOne({
        email: req.body.email
    },
    function (err, user) {
        if (user) {
            if (err) 
                res.render('company/company_signin', {
                    title: 'Signin',
                    message: "用户名不存在!"
                });
            if (Company.eptPass(req.password)==user.hashed_password) {
                req.session.user = user;
                res.redirect('/');
            }else{
                res.render('company/company_signin', {
                    title: 'Signin',
                    message: "密码不正确!"
                });
            };
        } else {
            return fn(new Error('cannot find user'));
        }
    });
    
};


//收到验证码后确认验证
exports.validate = function(req, res, next) {

};


/**
 * 创建公司账号
 */
exports.create = function(req, res, next) {
    var comapny = new Company(req.body);
    var message = null;

    comapny.provider = 'local';
    comapny.save(function(err) {
        if (err) {
            //检查信息是否重复
            
            return res.render('comapny/company_signup', {
                message: message,
                comapny: comapny
            });
        }
        req.session.user = company;
        res.redirect('/');
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
