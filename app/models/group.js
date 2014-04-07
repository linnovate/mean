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
        group_type: Array,
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

mongoose.model('Group', GroupModel);
