'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

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
        res.render('users/signup_success', {title: '注册成功'});
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