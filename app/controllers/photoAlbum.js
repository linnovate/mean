'use strict';

// node system
var fs = require('fs');
var crypto = require('crypto');

// mongoose and models
var mongoose = require('mongoose');
var PhotoAlbum = mongoose.model('PhotoAlbum');

// 3rd
var validator = require('validator');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');

// custom
var config = require('../../config/config');

exports.authorize = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/users/signin');
  }
};

exports.ownerFilter = function(req, res, next) {
  switch (req.body.owner) {
    case 'company_group':
      mongoose.model('CompanyGroup')
      .findOne({ _id: req.body.owner_id })
      .exec(function(err, company_group) {
        req.model = company_group;
        next();
      });
      break;
    default:
      res.send({ result: 0, msg: 'failed' });
      break;
  }
}


exports.createPhotoAlbum = function(req, res) {
  var photo_album = new PhotoAlbum({ name: req.body.name, update_user: req.user.nickname });
  photo_album.save(function(err) {
    if (err) {
      console.log(err);
    } else {

      async.waterfall([
        function(callback) {
          var pushObj = { pid: photo_album._id, name: photo_album.name };
          req.model.photo.push(pushObj);
          req.model.save(function(err) {
            if (err) callback(err);
            else {
              delete req.model;
              callback(null);
            }
          });
        },
        function(callback) {
          fs.mkdir(config.root + '/public/img/photo_album/' + photo_album._id, function(err) {
            if (err) callback(err);
            else {
              return res.send({ result: 1, msg: '创建相册成功' });
            }
          });
        }
      ], function(err, result) {
        if (err) console.log(err);
      });

    }
  });

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
    if (photo_album.hidden === false) {
      var data = {
        name: photo_album.name,
        update_date: photo_album.update_date,
        update_user: photo_album.update_user
      };
      res.send({ result: 1, msg: '获取相册信息成功', data: data });
    } else {
      res.send({ result: 0, msg: '该相册不存在' });
    }

  });
};

exports.updatePhotoAlbum = function(req, res) {
  var _id = req.params.photoAlbumId;
  var new_name = req.body.name;

  photoAlbumProcess(res, _id, function(photo_album) {
    if (photo_album.hidden === false) {
      photo_album.name = new_name;
      photo_album.save(function(err) {
        if (err) {
          throw err;
        } else {
          res.send({ result: 1, msg: '更新相册成功' });
        }
      });
    } else {
      res.send({ result: 0, msg: '该相册不存在' });
    }
  });
};

exports.deletePhotoAlbum = function(req, res) {
  var _id = req.params.photoAlbumId;
  if (validator.isAlphanumeric(_id)) {
    PhotoAlbum.findOne({ _id: _id }).exec(function(err, photo_album) {
      if (err) {
        console.log(err);
      } else if(photo_album) {
        photo_album.hidden = true;
        photo_album.save(function(err) {
          if (err) { console.log(err); }
          else {
            res.send({ result: 1, msg: '删除相册成功' });
          }
        });
      } else {
        res.send({ result: 0, msg: '删除相册失败' });
      }
    });
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
      if (photos.size) {
        photos = [photos];
      }

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
                  callback(err);
                } else {
                  var photo = {
                    uri: uri_dir + photo_name
                  };
                  photo_album.photos.push(photo);
                  photo_album.save(function(err) {
                    if (err) callback(err);
                    else {
                      fs.unlink(photos[i].path, function(err) {
                        if (err) callback(err);
                        else {
                          i++;
                          callback();
                        }
                      });
                    }
                  });
                }
            });
          },

          function(err) {
            if (err) {
              throw err;
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
    if (photo.hidden === false) {
      res.send({ result: 1, msg: '获取照片成功',
        data: {
          uri: photo.uri,
          comment: photo.comment
        }
      });
    } else {
      res.send({ result: 0, msg: '该照片不存在' });
    }
  });


};

exports.updatePhoto = function(req, res) {
  var pa_id = req.params.photoAlbumId;
  var p_id = req.params.photoId;

  photoProcess(res, pa_id, p_id, function(photo_album, photo) {
    if (photo.hidden === false) {
      photo.comment = req.body.comment;
      photo_album.save(function(err) {
        if (err) {
          throw err;
        } else {
          res.send({ result: 1, msg: '修改照片成功' });
        }
      });
    } else {
      res.send({ result: 0, msg: '该照片不存在' });
    }
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
              photos[i].hidden = true;
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
              if (photo.hidden === false) {
                var temp_photo = {};
                temp_photo.pid = photo._id;
                temp_photo.uri = photo.uri;
                temp_photo.comment = photo.comment;
                photos.push(temp_photo);
              }
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



