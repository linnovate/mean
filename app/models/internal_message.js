//企业内部站内信数据结构


'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InternalMessageSchema = new Schema({
  //1.员工之间互相发私信
  //2.该员工所属的组发布了一个活动要不要给他发私信(私信和动态重复)?
  //3.该员工所属的组发布了一个比赛但是还没有正式变为活动要不要给他发私信(私信和动态重复)?
  //4.比赛动态正式成为活动后要不要给该组的员工发私信?
  //5.活动关闭后要不要给该组的员工发私信?
  //6.对方组长应约后给发起比赛的组长发一封私信
  //7.一方组长发出比赛成绩确认请求后给另一方组长发一封私信
  //8.HR给组长发私信
  //9.HR给员工发私信
});

mongoose.model('InternalMessage', InternalMessageSchema);