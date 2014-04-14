'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * 企业组件
 */
var CompanyGroup = new Schema({
    cid: String,
    gid: String,
    group_type: String,
    name: String,
    member: Array,
    leader: {
        uid: Array,
        username: Array,
        realname: Array
    },
    score: Number,
    rank: Number,
    create_date: Date,
    brief: String
});

mongoose.model('CompanyGroup', CompanyGroup);