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


function photoAlbumProcess(res, _id, process) {
  if (validator.isAlphanumeric(_id)) {
    try {
      PhotoAlbum.findOne({ _id: _id }).exec(function(err, photo_album) {
        if (err) {
          throw err;
        } else {
          if (photo_album) {
            process(photo_album);
          } else {
            res.send({ result: 0, msg: '没有找到对应的相册' });
          }
        }
      });
    } catch(e) {
      res.send({ result: 0, msg: '获取相册信息失败' });
    }

  } else {
    res.send({ result: 0, msg: '请求错误' });
  }
}


exports.readPhotoAlbum = function(req, res) {
  var _id = req.params.photoAlbumId;

  photoAlbumProcess(res, _id, function(photo_album) {
    var data = {
      name: photo_album.name,
      update_date: photo_album.update_date,
      update_user: photo_album.update_user
    };
    res.send({ result: 1, msg: '获取相册信息成功', data: data });
  });
};

exports.updatePhotoAlbum = function(req, res) {
  var _id = req.params.photoAlbumId;
  var new_name = req.body.name;

  photoAlbumProcess(res, _id, function(photo_album) {
    photo_album.name = new_name;
    photo_album.save(function(err) {
      if (err) {
        throw err;
      } else {
        res.send({ result: 1, msg: '更新相册成功' });
      }
    });
  });
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
    res.send({ result: 0, msg: '请求错误' });
  }
};

exports.createPhoto = function(req, res) {
  var pa_id = req.params.photoAlbumId;
  var photos = req.files.photos;
  if (validator.isAlphanumeric(pa_id) && (photos.size > 0 || photos.length > 0)) {
    try {
      var uri_dir = '/img/photo_album/' + pa_id + '/';
      var photos = req.files.photos;

      PhotoAlbum.findOne({ _id: pa_id }).exec(function(err, photo_album) {

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
    res.send({ result: 0, msg: '请求错误' });
  }
};


function photoProcess(res, pa_id, p_id, process) {
  if (validator.isAlphanumeric(pa_id) && validator.isAlphanumeric(p_id)) {
    try {
      PhotoAlbum.findOne({ _id: pa_id }).exec(function(err, photo_album) {
        if (err) {
          throw err;
        } else {
          var photos = photo_album.photos;
          for (var i = 0; i < photos.length; i++) {
            // 此处需要类型转换后再比较, p_id:String, photos[i]._id:Object
            if (p_id == photos[i]._id) {
              return process(photo_album, photos[i]);
            }
          }

          res.send({ result: 0, msg: '没有找到对应的照片' });
        }
      });
    } catch (e) {
      res.send({ result: 0, msg: '获取照片失败' });
    }

  } else {
    res.send({ result: 0, msg: '请求错误' });
  }
}

exports.readPhoto = function(req, res) {
  var pa_id = req.params.photoAlbumId;
  var p_id = req.params.photoId;

  photoProcess(res, pa_id, p_id, function(photo_album, photo) {
    res.send({ result: 1, msg: '获取照片成功',
      data: {
        uri: photo.uri,
        comment: photo.comment
      }
    });
  });


};

exports.updatePhoto = function(req, res) {
  var pa_id = req.params.photoAlbumId;
  var p_id = req.params.photoId;

  photoProcess(res, pa_id, p_id, function(photo_album, photo) {
    photo.comment = req.body.comment;
    photo_album.save(function(err) {
      if (err) {
        throw err;
      } else {
        res.send({ result: 1, msg: '修改照片成功' });
      }
    });
  });

};

exports.deletePhoto = function(req, res) {
  var pa_id = req.params.photoAlbumId;
  var p_id = req.params.photoId;

  if (validator.isAlphanumeric(pa_id) && validator.isAlphanumeric(p_id)) {
    try {
      PhotoAlbum.findOne({ _id: pa_id }).exec(function(err, photo_album) {
        if (err) {
          throw err;
        } else {
          var photos = photo_album.photos;
          for (var i = 0; i < photos.length; i++) {
            // 此处需要类型转换后再比较, p_id:String, photos[i]._id:Object
            if (p_id == photos[i]._id) {
              var photo_path = config.root + '/public' + photos[i].uri;
              if (fs.existsSync(photo_path)) {
                fs.unlinkSync(photo_path);
              }
              photos.splice(i, 1);
              photo_album.save(function(err) {
                if (err) {
                  throw err;
                } else {
                  res.send({ result: 1, msg: '删除照片成功' });
                }
              });
              return;
            }
          }

          res.send({ result: 0, msg: '没有找到对应的照片' });
        }
      });
    } catch (e) {
      res.send({ result: 0, msg: '删除照片失败' });
    }

  } else {
    res.send({ result: 0, msg: '请求错误' });
  }
};


exports.readPhotos = function(req, res) {
  var _id = req.params.photoAlbumId;

  if (validator.isAlphanumeric(_id)) {
    try {
      PhotoAlbum.findOne({ _id: _id }).exec(function(err, photo_album) {
        if (err) {
          throw err;
        } else {
          if (photo_album) {
            var photos = [];
            photo_album.photos.forEach(function(photo) {
              var temp_photo = {};
              temp_photo.uri = photo.uri;
              temp_photo.comment = photo.comment;
              photos.push(temp_photo);
            });
            res.send({ result: 1, msg: '获取相册照片成功', data: photos });
          } else {
            res.send({ result: 0, msg: '相册不存在' });
          }
        }
      });
    } catch (e) {
      res.send({ result: 0, msg: '获取相册照片失败' });
    }
  } else {
    res.send({ result: 0, msg: '请求错误' });
  }
};


