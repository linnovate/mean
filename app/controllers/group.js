'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    GroupMessage = mongoose.model('GroupMessage'),
    Campaign = mongoose.model('Campaign'),
    User = mongoose.model('User'),
    Comapny = mongoose.model('Company'),
    Group = mongoose.model('Group'),
    CompanyGroup = mongoose.model('CompanyGroup');

exports.saveGroups = function(req,res) {
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

exports.getGroups = function(req,res) {
  Group.find(null,function(err,group){
      if (err) {
          res.status(400).send([]);
          return;
      };
      var _length = group.length;
      var groups = [];

      for(var i = 0; i < _length; i++ ){
        groups.push({'id':group[i].gid,'type':group[i].group_type,'select':'0'});
      }
      res.send(groups);
  });
};


exports.getAccount =function(req,res) {

};

exports.getInfo =function(req,res) {

};

exports.Info =function(req,res) {
  if(req.params.groupId == null) {
    res.redirect('/');
  }
  if(req.session.cpname != null || req.session.username != null ) {
      console.log(req.companyGroup);
      res.render('group/group_info', {
          title: '小组信息管理',
          companyGroup: req.companyGroup,
          companyname: req.session.cpname
      });
  }
  else
      res.redirect('/users/signin');
};

exports.saveInfo =function(req,res) {
    if(req.session.cid != null) {
      console.log(req.body);
        CompanyGroup.findOne({cid : req.session.cid, gid : req.body.companyGroup.gid}, function(err, companyGroup) {
            if (err) {
                console.log('数据错误');
                res.send({'result':0,'msg':'数据查询错误'});
                return;
            };
            if(companyGroup) {
                companyGroup.name = req.body.companyGroup.name;
                companyGroup.brief = req.body.companyGroup.brief;
                companyGroup.save(function (s_err){
                    if(s_err){
                        console.log(s_err);
                        res.send({'result':0,'msg':'数据保存错误'});
                        return;
                    }
                });
                res.send({'result':1,'msg':'更新成功'});
            } else {
                res.send({'result':0,'msg':'不存在组件！'});
            }
        });
    }
    else
        res.send("error");
};


//返回公司组件的所有数据,待前台调用
exports.getCompanyGroups = function(req, res) {

  var company_id = req.session.cid;
  var param_id = req.params.id;
  if(param_id) {
    company_id = param_id;
  }
  CompanyGroup.find({cid: company_id}, function(err, company_groups) {
    if (err) {
      return res.status(404).send([]);
    } else {
      return res.send(company_groups);
    }
  });

};

exports.group = function(req, res, next, id) {
  CompanyGroup
    .findOne({
        cid: req.session.cid,
        gid: id
    })
    .exec(function(err, companyGroup) {
        if (err) return next(err);
        if (!companyGroup) return next(new Error(req.session.cid+' Failed to load companyGroup ' + id));
        req.companyGroup = companyGroup;
        next();
    });
};



//组长发布一个活动(只能是一个企业)
exports.sponsor = function (req, res) {

  var cid = req.session.cid;  //公司id
  var uid = req.session.uid;  //用户id
  var gid = req.body.gid;  //组件id,注意,这里是数组,因为一个组长可以管理很多组
  var group_type = req.body.group_type; //组件类型,和id一一对应
  var content = req.body.content;//活动内容
  var cname = '';


  User.findOne({
        id : uid
    },
    function (err, user) {
      if (user) {

        //生成活动
        var campaign = new Campaign();
        campaign.campaign.gid.push(user.gid);
        campaign.campaign.group_type.push(group_type);
        campaign.campaign.cid.push(cid);

        Company.findOne({
            id : cid
          },
          function (err, company) {
            cname = company.info.name;
        });

        campaign.id = Date.now().toString(32) + Math.random().toString(32) + '0';
        campaign.campaign.poster.cname = cname;
        campaign.campaign.poster.cid = cid;
        campaign.campaign.poster.uid = uid;
        campaign.campaign.poster.role = 'LEADER';
        campaign.campaign.poster.realname = user.realname;
        campaign.campaign.poster.username = user.username;
        campaign.campaign.content = content;

        campaign.create_time = req.body.create_time;
        campaign.start_time = req.body.start_time;
        campaign.end_time = req.body.end_time;
        campaign.save(function(err) {
          if (err) {
            console.log(err);
            //检查信息是否重复
            switch (err.code) {
              case 11000:
                  break;
              case 11001:
                  res.status(400).send('该活动已经存在!');
                  break;
              default:
                  break;
            }
            return;
          };

          //生成动态消息
          var groupMessage = new GroupMessage();

          groupMessage.id = Date.now().toString(32) + Math.random().toString(32) + '1';
          groupMessage.group.gid.push(gid);
          groupMessage.group.group_type.push(group_type);
          groupMessage.group.active = true,
          groupMessage.group.date = req.body.create_time,

          groupMessage.group.poster.cname = cname;
          groupMessage.group.poster.cid = cid;
          groupMessage.group.poster.uid = uid;
          groupMessage.group.poster.role = 'LEADER';
          groupMessage.group.poster.realname = user.realname;
          groupMessage.group.poster.username = user.username;

          groupMessage.content = content;

          groupMessage.save(function(err) {
            if (err) {
              //错误信息
              return;
            }
          });
        });
      } else {
          //查无此人
      }
  });
};

