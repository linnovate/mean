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
  if(req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('users/signin', {
    title: 'Signin',
    message: req.flash('error')
  });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
  if(req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('users/signup', {
    title: 'Sign up',
    user: new User(),
    message: req.flash('error')
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
 * Create user
 */
exports.create = function(req, res, next) {
  var user = new User(req.body);
  req.assert('email', 'You must enter a valid email address').isEmail();
  req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
  req.assert('username', 'Username must be between 6-20 characters long').len(6, 20);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  req.flash('error', errors);
  if (errors) {
    return res.render('users/signup', {
      user: user,
      message: req.flash('error')
    });
  }

  user.provider = 'local';
  user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          req.flash('error', 'Username already taken');
          break;
        default:
          req.flash('error', 'Please fill all the required fields');
      }

      return res.render('users/signup', {
        user: user,
        message: req.flash('error')
      });
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
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