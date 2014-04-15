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
    gid: String,
    group_type: String,
    icon: String,
    active: false,
    group_rule: String,
});

mongoose.model('Group', GroupModel);
