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
    
    brief: {
      group_type: String,
      location: String,
      date:{
        type: Date,
        default: Date.now()
      },
      deadline: Date,
      competition_format: String,  //赛制
      remark: String               //备注
    },

    camp_a:{                  //A方阵营
      tname: String,
      member:[_member],
      cid: String,
      gid: String,
      rst_confirm: false,
      score: Number
    },
    camp_b:{                  //B方阵营
      tname: String,
      member:[_member],
      cid: String,
      gid: String,
      rst_confirm: false,
      score: Number
    },
    formation:[_formation],   //阵型图
    photo: Array
});

mongoose.model('Competition', Competition);