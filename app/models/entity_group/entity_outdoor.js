//户外增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var outdoor = new Schema({
    cid: String,
    gid: String
});

mongoose.model('OutDoor', outdoor);