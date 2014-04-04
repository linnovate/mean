'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    Group = mongoose.model('Group');


exports.saveGroups = function(req,res){
    res.send('save');
   /* var _length =req.body.group.length();
    for(var _i=0;_i<_length;_i++){

    }
    var group = new Group();
    group.name = req.body.name;
    company.info.city.province = req.body.province;
    company.info.city.city = req.body.city;
    company.info.address = req.body.address;
    company.info.linkman = req.body.linkman;
    company.info.lindline.areacode = req.body.areacode;
    company.info.lindline.number = req.body.number;
    company.info.lindline.extension = req.body.extension;
    company.info.phone = req.body.phone;
    company.email.host = req.body.host;
    company.email.domain[0] = req.body.domain;

    company.provider = 'company';
    company.save(function(err) {
        if (err) {
            console.log(err);
            //检查信息是否重复
            switch (err.code) {
                case 11000:
                    break;
                case 11001:
                    res.status(400).send('该公司已经存在!');
                    break;
                default:
                    break;
            }
            return res.render('company/company_signup', {
                company: company
            });
        }
        //发送邮件
        mail.sendCompanyActiveMail(company.email.host+'@'+company.email.domain[0],company.info.name);
        res.render('company/company_wait', {
            title: '等待验证',
            message: '您的申请信息已经提交,等验证通过后我们会向您发送一封激活邮件,请注意查收!'
        });
    });*/
};

exports.getGroups = function(req,res){
  Group.find(null,function(err,_body){
      if (err) {
          res.status(400).send([]);
          return;
      };
      var _length = _body[0].group.gid.length;
      var _groups = [];

      
      for(var _i=0;_i<_length;_i++){
        _groups.push({'id':_body[0].group.gid[_i],'type':_body[0].group._type[_i],'select':'0'});
      }
      
      console.log(_groups);
      console.log(_body[0]);
      res.send(_groups);
  });
};

