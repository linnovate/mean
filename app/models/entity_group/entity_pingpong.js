//乒乓球增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var pingpong = new Schema({
    cid: String,
    gid: String
});

mongoose.model('PingPong', pingpong);