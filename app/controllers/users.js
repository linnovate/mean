'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    encrypt = require('../middlewares/encrypt'),
    mail = require('../services/mail');

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
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

exports.invite = function(req, res) {
    var key = req.query.key;
    var name = req.query.name;
    if(key === undefined || name === undefined) {
        res.render('users/message', {title: 'error', message: 'bad request'});
    } else {
        if (encrypt.encrypt(name,'18801912891') === key) {
            req.session.key = key;
            req.session.name = name;
            res.render('users/invite', {
                title: 'validate'
            });
        }
    }
};

exports.validate = function(req, res) {
    var key = req.session.key;
    var name = req.session.name;
    if(encrypt.encrypt(name,'18801912891') === key) {
        Company.findOne({'username': name}).exec(function(err, company){
            if (company !== null) {
                for(var i = 0; i < company.email.domain.length; i++) {
                    if(req.body.domain === company.email.domain[i]) {
                        var user = new User();
                        mail.sendStaffActiveMail(req.body.host+'@'+company.email.domain[i], user.id);
                        res.render('users/message', {title: '验证邮件', message: '我们已经给您发送了验证邮件，请登录您的邮箱完成激活'});
                        return;
                    }
                }
            }
            res.render('users/message', {title: '验证失败', message: '验证失败'});
        });
    }
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
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
    User.findOne({
        username: req.body.username
    },
    function (err, user) {
        if (user) {
            if (err)
                res.render('users/signin', {
                    title: '用户登录',
                    message: '用户名不存在!'
                });
            if (User.eptPass(req.password) === user.hashed_password) {
                req.session.user.name = user.username;
                req.session.user.permission = user.permission;
                res.redirect('/');
            }else{
                res.render('users/signin', {
                    title: '用户登录',
                    message: '密码不正确!'
                });
            }
        } else {
            res.render('users/signin', {
                title: '用户登录',
                message: '用户不存在!'
            });
        }
    });
    
};


exports.create = function(req, res) {
    var user = new User();

    user.username = req.body.username;
    user.password = req.body.password;
    user.name = req.body.realName;
    user.info.department = req.body.department;
    user.info.phone = req.body.phone;

    user.save(function(err) {
        if(err) {
            // error produce
        }
        res.render('users/message', {title: '注册成功', message: '注册成功'});
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};