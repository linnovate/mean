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
    uid: String
});

/**
 * 活动
 */
var Campaign = new Schema({
    id: String,
    active: false,
    gid: Array,
    group_type: Array,
    cid: Array,           //参加该活动的所有公司
    cname: Array,
    poster: {
        cid: String,      //活动发起者所属的公司
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
    end_time: Date
});


/**
 * Pre-save hook
 */
 /*
Campaign.pre('save', function(next) {
    if (!this.isNew) return next();
});
*/

mongoose.model('Campaign', Campaign);