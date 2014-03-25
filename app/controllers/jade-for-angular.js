'use strict';

var jade = require('jade');
var config = require('../../config/config');

exports.render = function(req, res) {
  var angularJadePath = req.params[0];
  var html = jade.renderFile(config.root + '/public/views/' + angularJadePath);
  res.send(html);
};