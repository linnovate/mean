//足球增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var _member = new Schema({
    uid: String,
    username: String,
    logo: String,
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
 * 足球实体组件
 */
var footBall = new Schema({
    cid: String,
    gid: String,
    main_force: [_member],   //主力
    alternate: [_member],    //替补
    formation: [_formation], //阵型图
    family: String,          //全家福路径
    home_court: Array,       //主场(可能有多个)
    sponsor: String,         //赞助商
    score: Number,           //该小组分数
    rank: Number,            //该小组排名
    create_date: {
        type:Date,
        default:Date.now()
    }
});

mongoose.model('FootBall', footBall);