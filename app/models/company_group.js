'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var _member = new Schema({
    cid: String,
    uid: String,
    username: String,
    email: String,
    phone: String,
    number: Number
});


/**
 * 企业组件
 */
var CompanyGroup = new Schema({
    cid: String,
    gid: String,
    group_type: String,
    name: String,
    logo: String,
    member: [_member],
    leader: {
        uid: Array,
        username: Array
    },
    entity_type: String,
    brief: String,
    score: Number                //和增强组件里的score相同,避免多表查询,注意保持一致性!
});

mongoose.model('CompanyGroup', CompanyGroup);