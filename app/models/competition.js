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
    username: String,
    number: Number         //球队分配的个人号码
});

//阵形图子文档
var _formation = new Schema({
    uid: String,
    username: String,
    x: Number,
    y: Number
});
/**
 * 比赛数据结构
 */
var Competition = new Schema({
    date:{
      type: Date,
      default: Date.now()
    },
    location: String,
    content: String,
    camp_a:{                  //A方阵营
      member:[_member],
      cid: String,
      gid: String,
      rst_confirm: false,
      score: Number
    },
    camp_b:{                  //B方阵营
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