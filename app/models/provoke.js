//约战数据结构
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Provoke = new Schema({
    id: String,

    provoke_model: {
      type: String,
      enum: ['exercise','against','credit']
    },
    group_a: {
        lid: String,
        lname: String,
        lrealname: String,
        gid: String,
        group_type: String,
        score: Number,
        vote: Number,
        start_confirm: false,
        update_rst_confirm: false
    },
    group_b: {
        lid: String,
        lname: String,
        lrealname: String,
        gid: String,
        group_type: String,
        score: Number,
        vote: Number,
        start_confirm: false,
        update_rst_confirm: false
    },

    active: Boolean,
    date: {
        type: Date,
        default: Date.now()
    },

    poster: {
        cid: String,                  //约战发起人
        uid: String,
        cname: String,
        realname: String,
        username: String,
        role: {
            type: String,
            enum: ['HR','LEADER']
        },
    },
    content: String,
    convert_to_campaign: false
});


mongoose.model('Provoke', Provoke);