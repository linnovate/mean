'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Arena = mongoose.model('Arena');
exports.home = function(req, res) {
  Arena.find({'gid':req.session.gid},function(err,arenas){
      if (err) {
          console.log(err);
          res.status(400).send([]);
          return;
      };
      res.render('arena/arena_list', {'title': '擂台列表','arenas': arenas});
  });
};
exports.detail = function(req, res){
  res.render('arena/arena_detail', {'title': '擂台详情','arena': req.arena});

};
exports.arena = function(req, res, next, id){
    Arena
        .findOne({
            id: id
        })
        .exec(function(err, arena) {
            if (err) return next(err);
            if (!arena) return next(new Error('Failed to load arena ' + id));
            req.arena = arena;
            next();
        });
};
