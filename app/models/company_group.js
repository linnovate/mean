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
    group: {
        score: Number,
        rank: Number,
        create_date: Date,
        brief: String,
        gid: String,
        group_type: String,
        member: Array,
        leader: Array
    }
});

mongoose.model('CompanyGroup', CompanyGroup);