'use strict';

var mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    encrypt = require('../middlewares/encrypt');


exports.companyValidate = function(req, res) {

    var key = req.query.key;
    var name = req.query.name;

    Company.findOne({
        'info.name' : name
    },
    function (err, user) {
        if (user) {
            if(encrypt.encrypt(name,'18801912891') === key){
            	res.render('company/validate/confirm', {
                    title: '进一步注册',
                    message: '验证成功!'
            	});
            } else {
            	res.render('company/company_validate_error', {
                    title: '验证失败',
                    message: '验证码不正确!'
            	});
            }
        } else {
            res.render('company/company_validate_error', {
                title: '验证失败',
                message: '用户不存在!'
            });
        }
    });
};


exports.employeeValidate = function(req, res) {

};