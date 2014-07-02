'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    nodemailer = require('nodemailer'),
    async = require('async'),
    templates = require('../../../../config/env/all'),
    mailConfig = require('../../../../config/env/' + process.env.NODE_ENV),
    crypto = require('crypto'),
    transport = nodemailer.createTransport('SMTP', mailConfig.mailer);

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
    res.redirect('#!/login');
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

    user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('name', 'You must enter a name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('username', 'Username cannot be more than 20 characters').len(1,20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    user.roles = ['authenticated'];
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                    res.status(400).send([{
                        msg: 'Email already taken',
                        param: 'email'
                    }]);
                    break;
                case 11001:
                    res.status(400).send([{
                        msg: 'Username already taken',
                        param: 'username'
                    }]);
                    break;
                default:
                    var modelErrors = [];

                    if (err.errors) {

                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }

                        res.status(400).send(modelErrors);
                    }
            }

            return res.status(400);
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
        res.status(200);
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

/**
 * Resets the password
 */

exports.resetpassword = function(req, res, next) {
    console.log(req.params.token);
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Password token does not match '));
        user.password = req.body.password;
        // user.resetPasswordToken = undefined;
        // user.resetPasswordExpires = undefined;
        user.save(function(err) {
            req.logIn(user, function(err) {
              if (err) return next(err);
              return res.send({
                user: user,
              });
            });
            res.status(200);
         });
    });
};

/**
 * Callback for forgot password link
 */
exports.forgotpassword = function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if ((err) || (!user)) {
          done(true);
        }
        else {
          done(err, user, token);
        }
        });
    },
    function(user, token, done) {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function(err) {
            done(err, token, user);
        });
    },
    function(token, user, done) {

      var mailOptions = {
        to: req.body.email,
          from: 'SENDER EMAIL ADDRESS', // sender address
      };
      console.log(mailOptions);
      var message = 'Hey ' + user.name + '<br/> You are trying to reset ur password. Click on the link below to reset ur password' + 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + req.headers.host + '/#!/auth/reset/' + token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n';
      mailOptions.subject = 'Resetting the password';
      var mailBody = templates.notifyTemplate.forgotPassword.replace('{message}',message);
      mailOptions.html = mailBody;
      transport.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log('Message sent:'  + response.message);
        }
      });
       var response = {
        'msg' : 'Please check your mail',
        'type' : 'success'
       };
       res.jsonp(response);
       next();
    }
  ], function(err) {
    var response = {
        'error' : err,
        'type' : 'fail'
       };

    if (err) res.jsonp(response);
  });
};
