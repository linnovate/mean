'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * 用于子文档嵌套
 */
var _member = new Schema({
    cid: String,
    uid: String,
    username: String
});

/**
 * 活动
 */
var Campaign = new Schema({
    id: String,
    active: {
        type: Boolean,
        default: false
    },
    gid: Array,
    group_type: Array,
    cid: Array,                        //参加该活动的所有公司
    cname: Array,
    poster: {
        cid: String,                   //活动发起者所属的公司
        cname: String,
        uid: String,
        realname: String,
        username: String,
        role: {
            type: String,
            enum: ['HR','LEADER']      //HR 组长
        },
    },
    content: String,
    member: [_member],

    create_time: {
        type: Date,
        default: Date.now()
    },
    start_time: Date,
    end_time: Date,
    provoke: {                        //约战活动
        active: {
            type: Boolean,
            default: false
        },                            //如果是true就显示为约战活动,否则为普通活动
        team_a: String,               //约战方队名
        team_b: String,               //被约方队名
        competition_id: String        //对应的比赛的id
    }
});


Campaign.virtual('active_value').set(function(password) {
    ;
}).get(function() {
    return this.active ? '关闭' : '开启';
});
mongoose.model('Campaign', Campaign);