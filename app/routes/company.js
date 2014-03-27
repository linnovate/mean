'use strict';

// Company routes use company controller
var company = require('../controllers/company');

module.exports = function(app) {

    app.get('/company_signin', company.signin);
    app.get('/company_signup', company.signup);
    app.get('/company_signout', company.signout);
    app.get('/company/me', company.me);

    // Setting up the company api
    app.post('/company', company.create);

    // Setting up the companyId param
    app.param('companyId', company.company);

    // 可能改成直接遍历数据库进行验证的方法
    app.post('/company/session', company.session);
};
