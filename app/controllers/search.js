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
//根据公司和组件类型搜索小队
//返回该组件的队名和组长
exports.getTeam = function(req, res) {
  var cid = req.body.cid;
  var gid = req.session.gid;
  Company.findOne({'id':cid}, function (err, company) {
    if(err) {
      return res.send(err);
    } else {
      if(company) {
        var leader = [];
        var tname = '';
        for(var i = 0; i < company.group.length; i ++) {
          if(company.group[i].gid === gid) {
            leader = company.group[i].leader !== null && company.group[i].leader !== undefined ? company.group[i].leader : [];
            tname = company.group[i].tname;
          }
        }
        console.log(leader + '---' + tname);
        return res.send({
          'tname' : tname,
          'leader' : leader
        });
      } else {
        return res.send('null');
      }
    }
  });
}


//TODO
//根据公司id搜索成员(该成员不是该组的组长)
exports.getUser = function(req, res) {
  var cid = req.body.cid;   //根据公司名找它的员工
  var gid = req.body.gid;   //找选择了该组的员工
  console.log('GID:' + gid);
  User.find({'cid': cid , 'group.gid' : {'$all':[gid]},
    '$where':function(){
      for(var i = 0; i < this.group.length; i ++) {
        if(this.group[i].leader === true && this.group[i].gid === gid){
          return false;
        }
      }
      return true;
    }
  }, function (err, users){
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

