'use strict';

var photoAlbum = require('../controllers/photoAlbum');

module.exports = function(app) {

  app.post('/photoAlbum', photoAlbum.createPhotoAlbum);
  app.get('/photoAlbum/:photoAlbumId', photoAlbum.readPhotoAlbum);
  app.put('/photoAlbum/:photoAlbumId', photoAlbum.updatePhotoAlbum)
  app.delete('/photoAlbumId/:photoAlbumId', photoAlbum.deletePhotoAlbum);

  app.post('/photoAlbum/:photoAlbumId/photo', photoAlbum.createPhoto);
  app.get('/photoAlbum/:photoAlbumId/photo/:photoId', photoAlbum.readPhoto);
  app.put('/photoAlbum/:photoAlbumId/photo/:photoId', photoAlbum.updatePhoto);
  app.delete('/photoAlbum/:photoAlbumId/photo/:photoId', photoAlbum.deletePhoto);

  app.get('/photoAlbum/:photoAlbumId/photos', photoAlbum.readPhotos);

};
