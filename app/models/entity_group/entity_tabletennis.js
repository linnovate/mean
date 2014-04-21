//桌球增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var tabletennis = new Schema({
    cid: String,
    gid: String
});

mongoose.model('TableTennis', tabletennis);