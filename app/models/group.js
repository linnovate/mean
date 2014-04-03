'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * group Schema
 */
var GroupSchema = new Schema({
    id: String,
    type: {
        type: String,
        unique: true
    },

    name: String,

    select: {
        type: Boolean,
        default: false
    }
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
GroupSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.type) && !this.name)
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Methods
 */
GroupSchema.methods = {

};

mongoose.model('Group', GroupSchema);
