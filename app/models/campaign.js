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
    gid: String,
    uid: String
});

/**
 * 活动
 */
var Campaign = new Schema({
    campaign: {
        gid: Array,
        group_type: Array,
        cid: Array,
        cname: Array,
        poster: {
            cid: String,
            uid: String,
            realname: String,
            username: String,
            role: {
                type: String,
                enum: ['HR','LEADER']      //HR 组长
            },
        },
        member: [_member]
    },
    create_time: Date,
    start_time: Date,
    end_time: Date
});



mongoose.model('Campaign', Campaign);