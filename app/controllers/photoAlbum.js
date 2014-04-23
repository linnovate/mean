'use strict';

var mongoose = require('mongoose');
var PhotoAlbum = mongoose.model('PhotoAlbum');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });

exports.authorize = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/users/signin');
  }
};

exports.createPhotoAlbum = function(req, res) {

};

exports.readPhotoAlbum = function(req, res) {

};

exports.updatePhotoAlbum = function(req, res) {

};

exports.deletePhotoAlbum = function(req, res) {

};

exports.createPhoto = function(req, res) {

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
