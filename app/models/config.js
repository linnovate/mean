'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// 网站全局配置
var Config = new Schema({

    // 配置的名称，用于区分不同的配置。
    name: {
        type: String,
        unique: true
    },

    // 企业注册是否需要邀请码
    company_register_need_invite: {
        type: Boolean,
        default: true
    }
});

mongoose.model('Config', Config);
