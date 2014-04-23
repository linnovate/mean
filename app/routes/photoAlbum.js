'use strict';

var photoAlbum = require('../controllers/photoAlbum');

module.exports = function(app) {

  var authorize = photoAlbum.authorize;

  app.post('/photoAlbum', authorize, photoAlbum.createPhotoAlbum);
  app.get('/photoAlbum/:photoAlbumId', authorize, photoAlbum.readPhotoAlbum);
  app.put('/photoAlbum/:photoAlbumId', authorize, photoAlbum.updatePhotoAlbum)
  app.delete('/photoAlbumId/:photoAlbumId', authorize, photoAlbum.deletePhotoAlbum);

  app.post('/photoAlbum/:photoAlbumId/photo', authorize, photoAlbum.createPhoto);
  app.get('/photoAlbum/:photoAlbumId/photo/:photoId', authorize, photoAlbum.readPhoto);
  app.put('/photoAlbum/:photoAlbumId/photo/:photoId', authorize, photoAlbum.updatePhoto);
  app.delete('/photoAlbum/:photoAlbumId/photo/:photoId', authorize, photoAlbum.deletePhoto);

  app.get('/photoAlbum/:photoAlbumId/photos', authorize, photoAlbum.readPhotos);

  app.get('/pa/test', authorize, photoAlbum.test);

};
