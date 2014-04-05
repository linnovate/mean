'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * 组件模型
 */
var GroupModel = new Schema({
    group: {
        gid: Array,
        _type: Array,
        icon: Array
    }
});
/**
 * 组件的具体规则
 */
var GroupRule = new Schema({
    gid: String, //和 GroupModel 里的 gid 绑定
    rule: {
        //具体的规则,每种组件的规则可能各不一样,无法统一
    }
});


/**
 * 企业组件
 */
var CompanyGroup = new Schema({
    cid: String,
    group: {
        gid: Array,
        _type: Array,
        member: {
            number: Array,
            leader: Array
        }
    }
});



/**
 * 用于子文档嵌套
 */
var _member = new Schema({
    cid: String,
    gid: String,
    uid: String,
    person_score: Number
});

/**
 * 活动
 */
var Event = new Schema({
    _event: {
        gid: Array,
        _type: Array,
        cid: Array,
        poster: {
            cid: String,
            uid: String,
            role: {
                type: String,
                enum: ['M','L','E']      //HR 组长 普通员工
            },
        },
        member: [_member]
    },
    create_time: String,
    start_time: String,
    end_time: String
});

/*
//Event示例
//两个公司的两个组一起联谊搞活动
{
    event: {
        gid: ['0','1'],                     //两个组
        type: ['basketball', 'football'],
        cid: ['0010', '0056'],              //两个公司
        poster: {
            cid: '0056',
            uid: '10120979',
            role: 'HR'
        }
        member: [
            {
                cid: '0010',
                gid: '0',
                uid: '10120089',
                person_score: 2773
            },
            {
                cid: '0056',
                gid: '1',
                uid: '10120039',
                person_score: 277308089
            },
            {
                cid: '0010',
                gid: '0',
                uid: '13120089',
                person_score: 2
            },
            {
                cid: '0056',
                gid: '0',
                uid: '30126087',
                person_score: 13
            },
            {
                cid: '0010',
                gid: '0',
                uid: '70120039',
                person_score: -3
            },
            {
                cid: '0010',
                gid: '1',
                uid: '60120022',
                person_score: 567
            },
            {
                cid: '0010',
                gid: '1',
                uid: '90120111',
                person_score: 0
            }
        ],
        create_time: '2013-06-07 22:33:44',
        start_time: '2013-06-08 09:33:44',
        end_time: '2013-06-09 01:33:44'
    }
}
*/

/**
 * 消息
 */
var Message = new Schema({
    group: {
        gid: String,
        _type: String
    },
    cid :String,
    active: Boolean,
    poster: {
        cid: String,
        uid: String,
        role: {
            type: String,
            enum: ['M','L','E']      //HR 组长 普通员工
        },
    },
    count: Array
});


mongoose.model('Group', GroupModel);
mongoose.model('CompanyGroup', CompanyGroup);
mongoose.model('Event', Event);
mongoose.model('Message', Message);
