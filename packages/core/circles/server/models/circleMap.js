'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CircleMapSchema = new Schema({
  created: Date,
  updated: Date,
  col: String,
  circles : [{
    type: Schema.ObjectId,
    ref: 'Circle'
  }]

  //default authenticated

});

mongoose.model('CircleMap', CircleMapSchema);