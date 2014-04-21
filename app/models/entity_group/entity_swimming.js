//游泳增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var swimming = new Schema({
    cid: String,
    gid: String
});

mongoose.model('Swimming', swimming);