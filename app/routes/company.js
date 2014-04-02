'use strict';

// Company routes use company controller
var company = require('../controllers/company');

module.exports = function(app) {

    app.get('/company/signup', company.signup);
    app.get('/company/wait', company.wait);

    app.get('/company/validate', company.validate);

    app.get('/company/validate/error', company.validateError);
    app.get('/company/confirm', company.validateConfirm);
    app.get('/company/groupSelect', company.groupSelect);
    app.get('/company/sendInvateCode', company.sendInvateCode);

    // 提交公司申请信息
    app.post('/company', company.create);
    // 验证通过后进一步提交公司注册信息
    app.post('/confirm', company.createDetail);

    app.get('/company/invite', company.invite);

    // Setting up the companyId param
    app.param('companyId', company.company);
};
