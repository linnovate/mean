'use strict';

var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    LinkedinStrategy = require('passport-linkedin').Strategy,
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

    /**
     * Helper function to save or update a user.
     * When the user is logged in, it joins the user data to the existing one.
     * Otherwise it creates a new user.
     *
     * @author Kentaro Wakayama
     *
     * @date   2014-03-14
     *
     * @param  {Object}   req          This is the request object which contains the user when he is signed in.
     * @param  {String}   token        This is the accesstoken.
     * @param  {String}   tokenSecret  This is the refreshtoken.
     * @param  {Object}   profile      This is the user profile of the current provider.
     * @param  {Function} done         Callback to supply Passport with the user that authenticated.
     *
     * @param  {Object}   providerData This Object contains all data which is specific for the provider
     * @param  {String}   providerData.provider This is the passport provider name.
     * @param  {String}   providerData.idKey This is the Key / Attribute name for saving / retrieving the provider id.
     * @param  {String}   providerData.name This is the user's name.
     * @param  {String}   [providerData.email] This is the user's email.
     * @param  {String}   providerData.username This is the user's username.
     *
     * @return {[type]}                [description]
     */
    var saveOrUpdateUser = function(req, token, tokenSecret, profile, done, providerData) {
        var provider = providerData.provider;
        var idKey = providerData.idKey;
        var searchProviderKey = provider + '.' + idKey;
        var searchObject = {};
        searchObject[searchProviderKey] = profile.id;

        if (!req.user) {
            // no user active, this is a fresh login
            User.findOne(searchObject, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    user = new User({
                        name: providerData.name,
                        username: providerData.username,
                        provider: provider,
                    });
                    if (providerData.email) {
                        user.email = providerData.email;
                    }
                    user[provider] = profile._json;
                    user[provider].token = token;
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    user[provider].token = token;
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                }
            });
        } else {
            // a user is already logged in, join the provider data to the existing user.
            User.findById( req.user._id, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    user[provider] = profile._json;
                    user[provider].token = token;
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    };

    // Use local strategy
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

    // Use twitter strategy
    passport.use(new TwitterStrategy({
            consumerKey: config.twitter.clientID,
            consumerSecret: config.twitter.clientSecret,
            callbackURL: config.twitter.callbackURL,
            passReqToCallback: true
        },
        function(req, token, tokenSecret, profile, done) {

            var providerData = {
                provider: 'twitter',
                idKey: 'id_str',
                name: profile.displayName,
                username: profile.username,
            };

            saveOrUpdateUser(req, token, tokenSecret, profile, done, providerData);

        }
    ));

    // Use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {

            var providerData = {
                provider: 'facebook',
                idKey: 'id',
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.username,
            };

            saveOrUpdateUser(req, accessToken, refreshToken, profile, done, providerData);

        }
    ));

    // Use github strategy
    passport.use(new GitHubStrategy({
            clientID: config.github.clientID,
            clientSecret: config.github.clientSecret,
            callbackURL: config.github.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {

            var providerData = {
                provider: 'github',
                idKey: 'id',
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.username,
            };

            saveOrUpdateUser(req, accessToken, refreshToken, profile, done, providerData);

        }
    ));

    // Use google strategy
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {

            var providerData = {
                provider: 'google',
                idKey: 'id',
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.emails[0].value
            };

            saveOrUpdateUser(req, accessToken, refreshToken, profile, done, providerData);

        }
    ));

    // use linkedin strategy
    passport.use(new LinkedinStrategy({
            consumerKey: config.linkedin.clientID,
            consumerSecret: config.linkedin.clientSecret,
            callbackURL: config.linkedin.callbackURL,
            profileFields: ['id', 'first-name', 'last-name', 'email-address'],
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {

            var providerData = {
                provider: 'linkedin',
                idKey: 'id',
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.emails[0].value
            };

            saveOrUpdateUser(req, accessToken, refreshToken, profile, done, providerData);

        }
    ));
};