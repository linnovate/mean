'use strict';

var mongoose = require('mongoose');
var validator = require('validator');

var Schema = mongoose.Schema;



var Photo = new Schema({
  uri: String,
  publish_date: {
    type: Date,
    default: Date.now
  },
  hidden: {
    type: Boolean,
    default: false
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
  update_user: String,                    // 最后更新相册的用户昵称
  update_date: {
    type: Date,
    default: Date.now
  },
  hidden: {
    type: Boolean,
    default: false
  },
  photos: [Photo]
});

PhotoAlbum.pre('save', function(next) {
  this.name = validator.escape(this.name);
  this.update_date = Date.now();
  return next();
});

mongoose.model('PhotoAlbum', PhotoAlbum);

