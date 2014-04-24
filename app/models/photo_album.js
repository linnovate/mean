'use strict';

var mongoose = require('mongoose');
var validator = require('validator');

var Schema = mongoose.Schema;


var Photo = new Schema({
  id: Schema.Types.ObjectId,
  uri: String,
  publish_date: {
    type: Date,
    default: Date.now
  },
  comment: String
});

Photo.pre('save', function(next) {
  this.comment = validator.escape(this.comment);
  return next();
});

var PhotoAlbum = new Schema({
  name: {
    type: String,
    default: Date.now().toString()
  },
  publish_date: {
    type: Date,
    default: Date.now
  },
  update_date: {
    type: Date,
    default: Date.now
  },
  photos: [Photo]
});

PhotoAlbum.pre('save', function(next) {
  this.name = validator.escape(this.name);
  return next();
});

mongoose.model('PhotoAlbum', PhotoAlbum);