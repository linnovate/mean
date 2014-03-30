'use strict';

// Company routes use company controller
var company = require('../controllers/company');

module.exports = function(app) {

    app.get('/company_signup', company.signup);
    app.get('/company/me', company.me);
    app.get('/company_wait', company.wait);

    app.get('/company_validate_error', company.validate_error);
    app.get('/company_validate_next', company.validate_next);

    // Setting up the company api
    app.post('/company', company.create);

    app.post('/company_validate', company.createDetail)

    // Setting up the companyId param
    app.param('companyId', company.company);
};
