//比赛数据结构
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var _member = new Schema({
    camp: {                //阵营
      type: String,
      enum: ['A','B']
    },
    cid: String,
    uid: String,
    photo: String,         //队员头像路径
    username: String,
    number: Number         //球队分配的个人号码
});

//阵形图子文档
var _formation = new Schema({
    cid: String,
    uid: String,
    username: String,
    photo:String,
    x: Number,
    y: Number
});
/**
 * 比赛数据结构
 */
var Competition = new Schema({
    id: String,
    group_type: String,
    gid: String,
    brief: {
      location: {
        type: {
          type:String
        },
        coordinates: [],
        address : String
      },
      competition_date: Date,
      deadline: Date,
      competition_format: String,              //赛制
      remark: String,                          //备注
      number: Number                           //人数
    },

    camp_a:{                                   //A方阵营
      logo: String,                            //队徽路径
      cname: String,                           //本方公司名
      tname: String,
      member:[_member],
      cid: String,
      gid: String,
      start_confirm: {                         //双方组长都确认后才能开战
        type: Boolean,
        default: false
      },
      formation:[_formation],
      result: {                                //比赛结果确认
        confirm: {
          type: Boolean,
          default: false
        },
        content: String,
        start_date: Date
      },
      score: Number,
    },
    camp_b:{                                    //B方阵营
      logo: String,                             //队徽路径
      cname: String,                            //本方公司名
      tname: String,
      member:[_member],
      cid: String,
      gid: String,
      start_confirm: {                          //双方组长都确认后才能开战
        type: Boolean,
        default: false
      },
      formation:[_formation],
      result: {
        confirm: {
          type: Boolean,
          default: false
        },
        content: String,
        start_date: Date
      },
      score: Number
    },
    photo: Array,

    vote: {
        positive: {                             //赞成员工投票数
            type: Number,
            default: 0
        },
        positive_member: [_member],             //赞成员工id,cid
        negative: {                             //反对员工投票数
            type: Number,
            default: 0
        },
        negative_member: [_member]              //反对员工id,cid
    },
    content: String,
    convert_to_campaign: {
        type: Boolean,
        default: false
    },
    provoke_message_id: String
});

mongoose.model('Competition', Competition);