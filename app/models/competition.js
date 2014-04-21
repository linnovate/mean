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
    map: {
      location: String,                       //地图地点
      longitude: Number,                      //经度
      latitude: Number                        //纬度
    },

    brief: {
      location: String,
      competition_date: Date,
      deadline: Date,
      competition_format: String,              //赛制
      remark: String,                          //备注
      number: Number                           //人数
    },

    camp_a:{                                   //A方阵营
      logo: String,                            //队徽路径
      cname: String,                           //本方公司名
      uid: String,                             //队长id
      username: String,                        //队长用户名
      tname: String,
      member:[_member],
      cid: String,
      gid: String,
      start_confirm: false,                     //双方组长都确认后才能开战
      rst_confirm: false,
      score: Number
    },
    camp_b:{                                    //B方阵营
      logo: String,                             //队徽路径
      cname: String,                            //本方公司名
      uid: String,                              //队长id
      username: String,                         //队长用户名
      tname: String,
      member:[_member],
      cid: String,
      gid: String,
      start_confirm: false,                     //双方组长都确认后才能开战
      rst_confirm: false,
      score: Number
    },
    formation:[_formation],                     //阵型图
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
    convert_to_campaign: false,
    provoke_message_id: String
});

mongoose.model('Competition', Competition);