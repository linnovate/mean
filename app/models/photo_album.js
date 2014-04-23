'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PhotoAlbum = new Schema({
  name: String,
  publish_date: {
    type: Date,
    default: Date.now
  },
  photos: [{
    id: Schema.Types.ObjectId,
    uri: String,
    publish_date: {
      type: Date,
      default: Date.now
    },
    comment: String
  }]
});

mongoose.model('PhotoAlbum', PhotoAlbum);