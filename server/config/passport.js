'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    config = require('./config');

module.exports = function(passport) {

    // Serialize the user id to push into the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize the user object based on a pre-serialized token
    // which is the user id
    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashed_password', function(err, user) {
            done(err, user);
        });
    });

    // Use local strategy
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            });
        }
    ));

    // Use external strategies
    var strategies = ['facebook', 'github', 'google', 'linkedin', 'twitter'];
    strategies.forEach(function(strategy) {
        var Strategy = (strategy === 'google') ?
            require('passport-google-oauth').OAuth2Strategy :
            require('passport-' + strategy).Strategy;
        passport.use(new Strategy({
                clientID: config[strategy].clientID,
                clientSecret: config[strategy].clientSecret,
                consumerKey: config[strategy].clientID,
                consumerSecret: config[strategy].clientSecret,
                callbackURL: config[strategy].callbackURL,
                profileFields: config[strategy].profileFields
            },
            function(token1, token2, profile, done) {
                User.findOne({
                    'provider': strategy,
                    'providerData.id': profile.id
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            username: profile.username || profile.emails[0].value.split('@')[0],
                            provider: strategy,
                            providerData: profile._json
                        });
                        user.save(function(err) {
                            return done(err, user);
                        });
                    } else {
                        return done(err, user);
                    }
                });
            }
        ));
    });
};
