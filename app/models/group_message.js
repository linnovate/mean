'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * 组件消息(如果是企业发布的活动消息则归为虚拟组)
 */


var _camp = new Schema({
    cid: String,
    tname: {
        type: String,
        default: 'unknown'
    },
    vote: {                           //在投票按钮上显示票数,由于异步方式的多表查询有问题,所以这样定义也是无奈之举啊
        positive: {
            type: Number,
            default: 0
        },
        negative: {
            type: Number,
            default: 0
        }
    }
});

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
    location: String,                 //地点
    start_time: Date,                 //活动开始时间(或者比赛时间)
    end_time: Date,                   //活动结束时间(或者比赛截止时间)

    provoke: {                        //约战动态
        active: {
            type: Boolean,
            default: false            //如果是true就显示为约战动态,否则为普通动态
        },
        camp: [_camp],                //双方队名、投票情况
        start_confirm: {
            type: Boolean,
            default: false
        },                            //双方确认后才能变为true,此时不再显示"投票"按钮

        competition_format: String    //赛制
    }
});

mongoose.model('GroupMessage', GroupMessage);