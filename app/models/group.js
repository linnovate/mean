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
        id: {
            type: Array,
            default: [0, 1, 2, 3]  //注意: id type icon 一定要一一对应
        },
        type: {
            type: Array,
            default: ['basketball', 'football', 'game', 'virtual']
        },
        icon: {
            type: Array,
            default: ['path_b', 'path_f', 'path_g', 'path_v']
        }
    }
});
/**
 * 组件的具体规则
 */
var GroupRule = new Schema({
    gid: String, //和 GroupModel 里的 id 绑定
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
        id: Array,
        type: Array,
        member: {
            number: Array,
            leader: Array
        }
    }
});


var Event = new Schema({
    event: {
        gid: Array,
        type: Array,
        cid: Array,
        poster: {
            cid: String,
            uid: String,
            role: String
        },
        member: Array
    },
    create_time: String,
    start_time: String,
    end_time: String
});

/*
//Event示例

{
    event: {
        gid: ['0','1'],
        type: ['basketball', 'football'],
        cid: ['0010', '0056'],
        poster: {
            cid: '0056',
            uid: '10120979',
            role: 'HR'
        }
        member: [
            {
                cid: '0010',
                gid: '0',
                uid: '10120089'
            },
            {
                cid: '0056',
                gid: '1',
                uid: '10120039'
            },
            {
                cid: '0010',
                gid: '0',
                uid: '13120089'
            },
            {
                cid: '0056',
                gid: '0',
                uid: '30126087'
            },
            {
                cid: '0010',
                gid: '0',
                uid: '70120039'
            },
            {
                cid: '0010',
                gid: '1',
                uid: '60120022'
            },
            {
                cid: '0010',
                gid: '1',
                uid: '90120111'
            }
        ],
        create_time: '2013-06-07 22:33:44',
        start_time: '2013-06-08 09:33:44',
        end_time: '2013-06-09 01:33:44'
    }
}

*/
/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};


mongoose.model('Group', GroupModel);
