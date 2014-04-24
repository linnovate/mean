'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * 擂台模型
 */
var ArenaModel = new Schema({
    id: String,
    gid: String,
    group_type: String,
    area: String,
    champion:{
      logo: String,                            //队徽路径
      cname: String,                           //本方公司名
      uid: String,                             //队长id
      username: String,                        //队长用户名
      tname: String,
      cid: String,
      gid: String,
      active:{
        type: Boolean,
        default: false
      }
    },
    start_time:{
        type: Date,
        default: Date.now()
    }

});

mongoose.model('Arena', ArenaModel);
