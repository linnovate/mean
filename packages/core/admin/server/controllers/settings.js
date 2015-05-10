'use strict';

var mean = require('meanio');

exports.get = function(req, res) {

	if ( !req.query.name ) return res.jsonp(mean.config.flat.diff);
    // We have called it query.name by packageName
    mean.config.getSettings(req.query.name, function(error, doc) {
      return res.json(doc);
    });
};

exports.save = function(req, res) {
    mean.config.update(req.body, function(err, settings) {
        res.send(settings);
    });
};
