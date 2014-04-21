//阅读增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var reading = new Schema({
    cid: String,
    gid: String
});

mongoose.model('Reading', reading);