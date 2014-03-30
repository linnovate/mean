'use strict';

// User routes use users controller
var active = require('../controllers/active');

module.exports = function(app, passport) {

    app.get('/company_active_account', active.companyValidate);
};
