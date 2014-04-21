//k歌增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ktv = new Schema({
    cid: String,
    gid: String
});

mongoose.model('KTV', ktv);