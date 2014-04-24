//搜索各种数据(公司、组件、成员、地区等等)

'use strict';

var mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    User = mongoose.model('User');


//TODO
//列出所有公司
exports.getCompany = function (req, res) {
    var companies_rst = [];
    Company.find(null, function (err, companies) {
        if(err) {
            return res.send([]);
        } else {
            if(companies) {

                for(var i = 0; i < companies.length; i ++) {
                    companies_rst.push({
                        'id' : companies[i].id,
                        'name' : companies[i].info.name,
                        'group' : companies[i].group
                    });
                }
                return res.send(companies_rst);
            } else {
                return res.send([]);
            }
        }
    });
};


//TODO
//根据公司id搜索成员
exports.getUser = function(req, res) {
  var cid = req.body.cid;   //根据公司名找它的员工
  User.find({'cid': cid}, function (err, users){
    if(err){
      return res.send([]);
    }else{
      if(users){
        //数据量会不会太大?或许只需要员工的部分信息?
        return res.send(users);
      } else {
        return res.send([]);
      }
    }
  });
};
