//组长管理(比如组长发布组内活动,组内成员管理等)
'use strict';

var mongoose = require('mongoose'),
    encrypt = require('../middlewares/encrypt'),
    companyGroup = mongoose.model('CompanyGroup'),
    message = mongoose.model('Message'),
    Event = mongoose.model('Event'),
    User = mongoose.model('User'),
    config = require('../config/config');


//组长发布一个活动
/*
exports.sponsor = function (req, res) {
  var _cid = req.session.cid;  //公司id
  var uid = req.session.uid;  //用户id

  User.findOne({
        id : uid
    },
    function (err, user) {
      if (user) {

        //生成活动
        var _event = new Event();
        _event._event.gid.push(user.leader_group.gid);
        _event._event._type.push(user.leader_group._type);
        _event._event.cid.push(_cid);
        _event._event.poster.cid = _cid;
        _event._event.poster.uid = _uid;
        _event._event.poster.role = 'L';
        _event.create_time = req.body.create_time;
        _event.start_time = req.body.start_time;
        _event.end_time = req.body.end_time;
        _event.save(function(err) {
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

          var message = new Message();
          message.group.gid = user.leader_group.gid;
          message.group._type = user.leader_group._type;
          message.cid = _cid;
          message.active = true;
          message.poster.cid = _cid;
          message.poster.uid = _uid;
          message.poster.role = 'L';

          message.save(function(err) {
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
*/