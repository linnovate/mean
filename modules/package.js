'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Package Schema
 */
var PackageSchema = new Schema({
    name: String,
    settings: {},
    updated: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Package', PackageSchema);
