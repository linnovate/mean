//篮球增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var basketball = new Schema({
    cid: String,
    gid: String
});

mongoose.model('BasketBall', basketball);