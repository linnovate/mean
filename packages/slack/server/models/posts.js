'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var PostSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Number
    },
    test: {
        type: String
    },
    channel: {
        type: String
    }
});


/**
 * Statics
 */
PostSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Post', PostSchema);
