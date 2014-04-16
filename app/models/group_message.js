'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * 组件消息(如果是企业发布的活动消息则归为虚拟组)
 */
var GroupMessage = new Schema({
    id: String,
    cid: Array,                      //如果是约战消息,要在两家公司的主页同时显示
    group: {
        gid: Array,
        group_type: Array
    },
    active: Boolean,
    date: {
        type: Date,
        default: Date.now()
    },
    poster: {
        cid: String,                  //消息发布者所属的公司
        uid: String,
        cname: String,
        realname: String,
        username: String,
        role: {
            type: String,
            enum: ['HR','LEADER']     //HR 组长
        },
    },
    content: String,

    provoke: {                        //约战动态
        active: false,                //如果是true就显示为约战动态,否则为普通动态
        team_a: String,               //约战方队名
        team_b: String,               //被约方队名
    }
});



mongoose.model('GroupMessage', GroupMessage);