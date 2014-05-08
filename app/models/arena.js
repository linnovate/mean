'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

 var _champion = new Schema({
      logo: String,                            //队徽路径
      cname: String,                           //本方公司名
      uid: String,                             //队长id
      username: String,                        //队长用户名
      tname: String,
      cid: String,
      gid: String,
      champion_type: {
        type: String,
        enum: ['rob', 'challenge']
      },
      active:{
        type: Boolean,
        default: false
      },
      start_time:{
        type: Date,
        default: Date.now()
      },
      end_time: {
        type: Date
      },
      score: Number,
      win_time: Number,

      campaign_id :Array
    });
/**
 * 擂台模型
 */
var ArenaModel = new Schema({
    id: String,
    gid: String,
    group_type: String,
    city: {
            province: String,
            city: String
    },
    campaign_info:{
      location: {
        type: {
          type:String
        },
        coordinates: Array,
        name: String,
        address : String
      },
      content:String,
      competition_date: Date,
      deadline: Date,
      competition_format: String,              //赛制
      remark: String,                          //备注
      number: Number                           //人数
    },
    champion: {
      logo: String,                            //队徽路径
      cname: String,                           //本方公司名
      uid: String,                             //队长id
      username: String,                        //队长用户名
      tname: String,
      cid: String,
      gid: String,
      champion_type: {
        type: String,
        enum: ['rob', 'challenge']
      },
      active:{
        type: Boolean,
        default: false
      },
      provoke_status:{
        type: Boolean,
        default: false
      },
      start_time:{
        type: Date,
        default: Date.now()
      },
      end_time: {
        type: Date
      },
      score: Number,
      win_time: Number,
      campaign_id :Array
    },
    history: [_champion]

});

mongoose.model('Arena', ArenaModel);
