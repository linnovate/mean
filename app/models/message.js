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
    group: {
        gid: Array,
        group_type: Array
    },
    active: Boolean,
    date: Date,
    poster: {
        cid: String,
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


/**
 * 系统消息
 */
var SystemMessage = new Schema({

});



mongoose.model('GroupMessage', GroupMessage);