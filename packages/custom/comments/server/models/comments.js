'use strict';

/**
 * Required dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Basic Schema
 * @type {Schema}
 */
var ModelSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  article: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Article'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Create the model
 */
mongoose.model('Comment', ModelSchema);