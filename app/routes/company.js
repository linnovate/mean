'use strict';

// Company routes use company controller
var company = require('../controllers/company');

module.exports = function(app) {

    app.get('/company_signup', company.signup);
    app.get('/company/me', company.me);
    app.get('/company_wait', company.wait);

    app.get('/company_validate_error', company.validateError);
    app.get('/company_validate_confirm', company.validateConfirm);
    app.get('/company_group_select', company.groupSelect);
    app.get('/company_send_invate_code', company.sendInvateCode);

    // 提交公司申请信息
    app.post('/company', company.create);
    // 验证通过后进一步提交公司注册信息
    app.post('/confirm', company.createDetail)

    // Setting up the companyId param
    app.param('companyId', company.company);
};
