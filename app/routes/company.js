'use strict';

// User routes use company controller
var company = require('../controllers/company');

module.exports = function(app, passport) {

    app.get('/company_signin', company.signin);
    app.get('/company_signup', company.signup);
    app.get('/company_signout', company.signout);
    app.get('/company/me', company.me);

    // Setting up the users api
    app.post('/company', company.create);

    // Setting up the userId param
    app.param('companyId', company.company);

    // Setting the local strategy route
    app.post('/company/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), company.session);