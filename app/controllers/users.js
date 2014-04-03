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
                        user.email = req.body.host + '@' + req.body.domain;
                        user.company_id = company._id;
                        user.save(function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        mail.sendStaffActiveMail(user.email, user.id);
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
    var key = req.query.key;
    var uid = req.query.uid;
    if(encrypt.encrypt(uid,'18801912891') === key) {
        res.render('users/signup', {
            title: 'Sign up',
            key: key,
            uid: uid
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
    req.session.username = req.body.email;
    res.redirect('/users/edit/info');
};


exports.create = function(req, res) {
    User.findById(
        req.query.uid
    , function(err, user) {
        if(err) {
            console.log(err);
        }
        else {
            if (user) {
                user.username = user.email;
                user.nickname = req.body.nickname;
                user.password = req.body.password;
                user.realName = req.body.realName;
                user.department = req.body.department;
                user.phone = req.body.phone;
                user.active = true;

                user.save(function(err) {
                    if(err) {
                        console.log(err);
                    }
                    res.render('users/message', {title: '注册成功', message: '注册成功'});
                });
            } else {
                res.render('users/message', {title: 'failed', message: 'failed'});
            }
        }
    });

};


exports.infoEditForm = function(req, res) {
    User.findOne({
        username: req.session.username
    },
    function (err, user) {
        if(err) {
            console.log(err);
        } else if(user) {
            Company.findById(user.company_id, function(err, company) {
                if(err) {
                    console.log(err);
                } else if(company) {
                    res.render('users/edit_info', {title: '编辑个人资料', user: user, company: company});
                }
            });
        }
    });
};

exports.edit = function(req, res) {
    User.findOne({
        username: req.session.username
    },
    function(err, user) {
        if(err) {
            console.log(err);
        } else if(user) {
            user.nickname = req.body.nickname;
            user.realname = req.body.realname;
            user.position = req.body.position;
            user.sex = req.body.sex;
            user.birthday = req.body.birthday;
            user.bloodType = req.body.bloodType;
            user.introduce = req.body.introduce;
            user.save(function(err){
                if(err) {
                    console.log(err);
                } else {
                    res.render('users/message', {title: '保存成功', message: '保存成功'});
                }
            });
        } else {
            res.render('users/message', {title: '保存失败', message: '保存失败'});
        }
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