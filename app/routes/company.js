'use strict';

// Company routes use company controller
var company = require('../controllers/company');

module.exports = function(app, passport) {

    //显示企业小组列表
    app.get('/company/groupList', company.groupList);
    app.get('/company/signup', company.signup);
    app.get('/company/wait', company.wait);

    app.get('/company/signin', company.signin);
    app.post('/company/session', passport.authenticate('company', {
        failureRedirect: '/company/signin',
        failureFlash: true
    }), company.loginSuccess);

    app.get('/company/validate', company.validate);//点击公司激活链接

    app.get('/company/validate/error', company.validateError);


    app.get('/company/confirm', company.validateConfirm);//下面三个子页面当父页面
    app.get('/company/create_company_account', company.create_company_account);//创建公司账号
    app.get('/company/select', company.select);//选择组件
    app.get('/company/invite', company.invite);//发送邀请链接

    app.get('/company/getAccount', company.getAccount);
    app.get('/company/getInfo', company.getInfo);
    app.get('/company/info', company.Info);

    app.post('/company/saveAccount', company.saveAccount);

    app.post('/company/groupSelect', company.groupSelect);
    app.post('/company', company.create);// 提交公司申请信息
    app.post('/company/createDetail', company.createDetail);// 验证通过后进一步提交公司注册信息

    //企业发布活动
    app.get('/company/campaignSponsor', company.showSponsor);
    app.post('/company/campaignSponsor', company.sponsor);

    app.get('/company/getCompanyMessages', company.getCompanyMessage);
    app.get('/company/getCampaigns', company.getCompanyCampaign);

    app.get('/company/home', company.home);

    // Setting up the companyId param
    app.param('companyId', company.company);
};
