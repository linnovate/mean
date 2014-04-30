'use strict';

var photoAlbum = require('../controllers/photoAlbum');

var express = require('express');
var config = require('../../config/config');
var photoBodyParser = express.bodyParser({
  uploadDir: config.root + '/temp_uploads/',
  limit: 1024 * 500 });

module.exports = function(app) {

  var authorize = photoAlbum.authorize;

  app.post('/photoAlbum', authorize, photoAlbum.ownerFilter, photoAlbum.createPhotoAlbum);
  app.get('/photoAlbum/:photoAlbumId', authorize, photoAlbum.readPhotoAlbum);
  app.put('/photoAlbum/:photoAlbumId', authorize, photoAlbum.updatePhotoAlbum)
  app.delete('/photoAlbum/:photoAlbumId', authorize, photoAlbum.deletePhotoAlbum);

  app.post('/photoAlbum/:photoAlbumId/photo', authorize, photoBodyParser, photoAlbum.createPhoto);
  app.get('/photoAlbum/:photoAlbumId/photo/:photoId', authorize, photoAlbum.readPhoto);
  app.put('/photoAlbum/:photoAlbumId/photo/:photoId', authorize, photoAlbum.updatePhoto);
  app.delete('/photoAlbum/:photoAlbumId/photo/:photoId', authorize, photoAlbum.deletePhoto);

  app.get('/photoAlbum/:photoAlbumId/photolist', authorize, photoAlbum.readPhotos);
  app.get('/photoAlbum/:photoAlbumId/preview', authorize, photoAlbum.preview);

};
