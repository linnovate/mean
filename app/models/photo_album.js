'use strict';

var mongoose = require('mongoose');
var validator = require('validator');

var Schema = mongoose.Schema;

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
  photos: [{
    id: {
      type: Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId
    },
    uri: String,
    publish_date: {
      type: Date,
      default: Date.now
    },
    comment: String
  }]
});

PhotoAlbum.pre('save', function(next) {
  this.name = validator.escape(this.name);
  this.update_date = Date.now();
  for (var i = 0; i < this.photos.length; i++) {
    var photo = this.photos[i];
    if (photo) {
      photo.comment = validator.escape(photo.comment);
    }
  }
  return next();
});

mongoose.model('PhotoAlbum', PhotoAlbum);

