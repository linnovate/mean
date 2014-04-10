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
    group: {
        gid: Array,
        group_type: Array
    },
    active: Boolean,
    date: {
        type: Date,
        default: Date.now();
    },
    poster: {
        cid: String,                  //消息发布者所属的公司
        uid: String,
        cname: String,
        realname: String,
        username: String,
        role: {
            type: String,
            enum: ['HR','LEADER']      //HR 组长
        },
    },
    content: String
});



mongoose.model('GroupMessage', GroupMessage);