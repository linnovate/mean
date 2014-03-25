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
    res.render('company/signin', {
        title: '登录',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('company/signup', {
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
    res.redirect('/');
};

/**
 * Create company
 */
exports.create = function(req, res, next) {
    var comapny = new Company(req.body);
    var message = null;

    comapny.provider = 'local';
    comapny.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = '用户名已经存在!';
                    break;
                default:
                    message = '请填写完整信息啊!';
            }

            return res.render('comapny/signup', {
                message: message,
                comapny: comapny
            });
        }
        req.logIn(company, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
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
exports.comapny = function(req, res, next, id) {
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
