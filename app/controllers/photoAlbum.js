'use strict';

var mongoose = require('mongoose');
var PhotoAlbum = mongoose.model('PhotoAlbum');
var validator = require('validator');
var crypto = require('crypto');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var config = require('../../config/config');
var async = require('async');

exports.authorize = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/users/signin');
  }
};

exports.createPhotoAlbum = function(req, res) {
  var photo_album = new PhotoAlbum({ name: req.body.name, update_user: req.user.nickname });
  try {
    photo_album.save(function(err) {
      if (err) {
        throw err;
      } else {
        fs.mkdirSync(config.root + '/public/img/photo_album/' + photo_album._id);
        res.send({ result: 1, msg: '创建相册成功' });
      }
    });
  } catch(e) {
    res.send({ result: 0, msg: '创建相册失败' });
  }
};

exports.readPhotoAlbum = function(req, res) {
  var _id = req.params.photoAlbumId;
  if (validator.isAlphanumeric(_id)) {
    try {
      PhotoAlbum.findOne({ _id: _id }).exec(function(err, photo_album) {
        if (err) {
          throw err;
        } else {
          if (photo_album) {
            var data = {
              name: photo_album.name,
              update_date: photo_album.update_date,
              update_user: photo_album.update_user
            };
            res.send({ result: 1, msg: '获取相册信息成功', data: data });
          }
        }
      });
    } catch(e) {
      res.send({ result: 0, msg: '获取相册信息失败' });
    }

  } else {
    res.send({ result: 0, msg: '获取相册信息失败' });
  }
};

exports.updatePhotoAlbum = function(req, res) {
  var _id = req.params.photoAlbumId;
  var new_name = req.body.name;
  if (validator.isAlphanumeric(_id)) {
    try {
      PhotoAlbum.findOne({ _id: _id }).exec(function(err, photo_album) {
        if (err) {
          throw err;
        } else {
          if (photo_album) {
            photo_album.name = new_name;
            photo_album.save(function(err) {
              if (err) {
                throw err;
              } else {
                res.send({ result: 1, msg: '更新相册成功' });
              }
            });
          }
        }
      });
    } catch (e) {
      res.send({ result: 0, msg: '更新相册失败' });
    }
  } else {
    res.send({ result: 0, msg: '更新相册失败' });
  }
};

exports.deletePhotoAlbum = function(req, res) {
  var _id = req.params.photoAlbumId;
  if (validator.isAlphanumeric(_id)) {
    try {
      PhotoAlbum.remove({ _id: _id }).exec(function(err) {
        if (err) {
          throw err;
        } else {
          res.send({ result: 1, msg: '删除相册成功' });
        }
      });
    } catch (e) {
      res.send({ result: 0, msg: '删除相册失败' });
    }
  } else {
    res.send({ result: 0, msg: '删除相册失败' });
  }
};

exports.createPhoto = function(req, res) {
  var _id = req.params.photoAlbumId;
  if (validator.isAlphanumeric(_id) && req.files.photos.length > 0) {
    try {
      var uri_dir = '/img/photo_album/' + _id + '/';
      var photos = req.files.photos;

      PhotoAlbum.findOne({ _id: _id }).exec(function(err, photo_album) {

        var i = 0;

        async.whilst(
          function() { return i < photos.length; },
          function(callback) {
            var photo_name = Date.now().toString() + '.png';
            gm(photos[i].path)
            .write(config.root + '/public' + uri_dir + photo_name,
              function(err) {
                if (err) {
                  throw err;
                } else {
                  var photo = {
                    uri: uri_dir + photo_name
                  };
                  photo_album.photos.push(photo);
                  photo_album.save(function(err) {
                    if (err) throw err;
                  });
                }
            });
            i++;
            callback();
          },
          function(err) {
            if (err) {
              throw err;
              res.send({ result: 0, msg: '添加照片失败' });
            } else {
              res.send({ result: 1, msg: '添加照片成功' });
            }
          }
        );
      });

    } catch (e) {
      res.send({ result: 0, msg: '添加照片失败' });
    }
  } else {
    res.send({ result: 0, msg: '添加照片失败' });
  }
};

exports.readPhoto = function(req, res) {

};

exports.updatePhoto = function(req, res) {

};

exports.deletePhoto = function(req, res) {

};


exports.readPhotos = function(req, res) {

};

exports.test = function(req, res) {
  res.render('photoAlbum/test');
}
