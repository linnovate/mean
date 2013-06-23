/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')
  , logger = require('mean-logger')


exports.render = function(req, res){
  logger.log("test");

  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : "null"
  })
} 
