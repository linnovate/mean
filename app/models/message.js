'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * 组件消息
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
        role: {
            type: String,
            enum: ['HR','LEADER','EMPLOYEE']      //HR 组长 普通员工
        },
    },
    content: Array
});


/**
 * 企业活动消息
 */
var CampaignMessage = new Schema({

});

/**
 * 系统消息
 */
var SystemMessage = new Schema({

});

mongoose.model('GroupMessage', GroupMessage);
mongoose.model('CampaignMessage', CampaignMessage);
mongoose.model('SystemMessage', SystemMessage);