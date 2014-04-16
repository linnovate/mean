//约战数据结构
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
    /*
    username: String,
    realname: String,
    email: String,
    phong: String,
    qq: String,
    department: String,
    position: String,
    sex: {
        type: String,
        enum: ['男', '女']
    }
    */
});


var Provoke = new Schema({
    id: String,
    gid: String,                             //只能是同一类型的组进行约战
    group_type: String,
    provoke_model: {
      type: String,
      enum: ['exercise','against','credit']
    },
    group_a: {
        tname: String,                       //队名
        cid: String,
        cname: String,
        lid: String,
        lname: String,
        lrealname: String,
        score: Number,
        start_confirm: false,                //双方组长都确认后才能开战
        update_rst_confirm: false            //双方组长都确认后才能上传积分
    },
    group_b: {
        tname: String,
        cid: String,
        cname: String,
        lid: String,
        lname: String,
        lrealname: String,
        score: Number,
        start_confirm: false,
        update_rst_confirm: false
    },
    active: false,
    date: {
        type: Date,
        default: Date.now()
    },
    poster: {
        cid: String,                           //约战发起人
        uid: String,
        cname: String,
        realname: String,
        username: String,
        role: {
            type: String,
            enum: ['HR','LEADER']
        },
    },
    vote: {
        positive: {                            //赞成员工投票数
            type: Number,
            default: 0
        },
        positive_member: [_member],             //赞成员工id,cid
        negative: {                             //反对员工投票数
            type: Number,
            default: 0
        },
        negative_member: [_member]              //反对员工id,cid
    },
    content: String,
    convert_to_campaign: false,
    provoke_message_id: String
});
mongoose.model('Provoke', Provoke);