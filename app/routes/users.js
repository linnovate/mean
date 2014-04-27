'use strict';

// User routes use users controller
var users = require('../controllers/users');

var express = require('express');
var config = require('../../config/config');
var photoBodyParser = express.bodyParser({ uploadDir: config.root + '/temp_uploads/' });

module.exports = function(app, passport) {

    var authorize = users.authorize;

    app.get('/users/signin', users.signin);
    app.get('/users/signout', authorize, users.signout);
    // Setting the local strategy route
    app.post('/users/session', passport.authenticate('user', {
        failureRedirect: '/users/signin',
        failureFlash: true
    }), users.loginSuccess);

    app.get('/users/home', authorize, users.home);

    // Active produce
    app.get('/users/invite', users.invite);
    app.post('/users/dealActive', users.dealActive);
    app.get('/users/setProfile', users.setProfile);
    app.post('/users/dealSetProfile', users.dealSetProfile);
    app.get('/users/selectGroup', users.selectGroup);
    app.post('/users/dealSelectGroup', users.dealSelectGroup);
    app.get('/users/finishRegister', users.finishRegister);


    app.get('/users/getGroupMessages', authorize, users.getGroupMessages);
    app.get('/users/getCampaigns', authorize, users.getCampaigns);

    app.get('/users/getAccount', authorize, users.getAccount);
    app.post('/users/saveAccount', authorize, users.saveAccount);
    app.post('/users/changePassword', authorize, users.changePassword);
    app.get('/users/editInfo', authorize, users.editInfo);

    app.post('/users/joinCampaign', authorize, users.joinCampaign);
    app.post('/users/quitCampaign', authorize, users.quitCampaign);

    app.post('/users/vote', authorize, users.vote);

    app.post('/users/tempPhoto', authorize, photoBodyParser, users.tempPhoto);
    app.post('/users/savePhoto', authorize, users.savePhoto);

    app.get('/users/editPhoto', authorize, users.editPhoto);

    app.get('/userPhoto/:id/:width/:height', users.getPhoto);

};
