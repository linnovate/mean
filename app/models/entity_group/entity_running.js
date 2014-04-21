//跑步增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var running = new Schema({
    cid: String,
    gid: String
});

mongoose.model('Running', running);